import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore on boot as required
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export interface CloudUserPreferences {
  ownerId: string;
  displayName: string;
  favoriteDrivers: string[];
  favoriteTeams: string[];
  units: 'metric' | 'imperial';
  defaultSeason: number;
}

const ID_REGEX = /^[a-zA-Z0-9_\-]+$/;

export function sanitizeCloudPayload(
  uid: string,
  displayName: string,
  favoriteDrivers: string[],
  favoriteTeams: string[],
  units: 'metric' | 'imperial',
  defaultSeason: number
): CloudUserPreferences {
  const cleanUid = uid.slice(0, 128);
  const cleanName = (displayName || 'F1 Paddock Member').trim().slice(0, 80) || 'F1 Paddock Member';
  const cleanDrivers = Array.from(new Set(favoriteDrivers))
    .filter((d) => typeof d === 'string' && d.length >= 1 && d.length <= 64 && ID_REGEX.test(d))
    .slice(0, 25);
  const cleanTeams = Array.from(new Set(favoriteTeams))
    .filter((t) => typeof t === 'string' && t.length >= 1 && t.length <= 64 && ID_REGEX.test(t))
    .slice(0, 15);
  const cleanUnits: 'metric' | 'imperial' = units === 'imperial' ? 'imperial' : 'metric';
  const cleanSeason =
    Number.isInteger(defaultSeason) && defaultSeason >= 1950 && defaultSeason <= 2030
      ? defaultSeason
      : 2026;

  return {
    ownerId: cleanUid,
    displayName: cleanName,
    favoriteDrivers: cleanDrivers,
    favoriteTeams: cleanTeams,
    units: cleanUnits,
    defaultSeason: cleanSeason,
  };
}

export async function signInWithGooglePopup(): Promise<User> {
  const cred = await signInWithPopup(auth, googleProvider);
  return cred.user;
}

export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName.trim()) {
    await updateProfile(cred.user, { displayName: displayName.trim().slice(0, 80) });
  }
  try {
    await sendEmailVerification(cred.user);
  } catch {
    // non-fatal if verification email throttled
  }
  return cred.user;
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function recoverPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function logoutFirebase(): Promise<void> {
  await signOut(auth);
}

export async function saveUserPreferencesToCloud(
  user: User,
  prefs: {
    favoriteDrivers: string[];
    favoriteTeams: string[];
    units: 'metric' | 'imperial';
    defaultSeason: number;
  },
  mergeGuestFavorites = false
): Promise<void> {
  if (!user.emailVerified) {
    throw new Error(
      'Please verify your email address (or sign in with a verified Google account) before writing to cloud storage.'
    );
  }
  const path = `users/${user.uid}`;
  const docRef = doc(db, 'users', user.uid);

  let existingDoc;
  try {
    existingDoc = await getDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }

  let driversToSave = prefs.favoriteDrivers;
  let teamsToSave = prefs.favoriteTeams;

  if (mergeGuestFavorites && existingDoc?.exists()) {
    const data = existingDoc.data();
    const existingDrivers = Array.isArray(data.favoriteDrivers) ? data.favoriteDrivers : [];
    const existingTeams = Array.isArray(data.favoriteTeams) ? data.favoriteTeams : [];
    driversToSave = Array.from(new Set([...existingDrivers, ...prefs.favoriteDrivers]));
    teamsToSave = Array.from(new Set([...existingTeams, ...prefs.favoriteTeams]));
  }

  const sanitized = sanitizeCloudPayload(
    user.uid,
    user.displayName || user.email?.split('@')[0] || 'F1 Paddock Member',
    driversToSave,
    teamsToSave,
    prefs.units,
    prefs.defaultSeason
  );

  if (!existingDoc?.exists()) {
    try {
      await setDoc(docRef, {
        ...sanitized,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  } else {
    try {
      await updateDoc(docRef, {
        displayName: sanitized.displayName,
        favoriteDrivers: sanitized.favoriteDrivers,
        favoriteTeams: sanitized.favoriteTeams,
        units: sanitized.units,
        defaultSeason: sanitized.defaultSeason,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }
}

export { onAuthStateChanged, onSnapshot, doc };
export type { User };
