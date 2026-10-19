import React, { useState } from 'react';
import {
  X,
  UserCheck,
  LogIn,
  UserPlus,
  KeyRound,
  Cloud,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  LogOut,
} from 'lucide-react';
import {
  User,
  signInWithGooglePopup,
  registerWithEmail,
  loginWithEmail,
  recoverPassword,
  logoutFirebase,
} from '../services/firebaseClient';

interface AuthModalProps {
  currentUser: User | null;
  cloudSyncStatus: 'guest' | 'synced' | 'syncing' | 'error';
  cloudSyncMessage: string | null;
  guestDriversCount: number;
  guestTeamsCount: number;
  onAuthSuccessMigrateGuest: (user: User, mergeGuest: boolean) => Promise<void>;
  onManualSyncNow: () => Promise<void>;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  cloudSyncStatus,
  cloudSyncMessage,
  guestDriversCount,
  guestTeamsCount,
  onAuthSuccessMigrateGuest,
  onManualSyncNow,
  onClose,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [mergeGuestData, setMergeGuestData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setInfoMsg(null);
    setLoading(true);
    try {
      const user = await signInWithGooglePopup();
      await onAuthSuccessMigrateGuest(user, mergeGuestData);
      setInfoMsg('Signed in with Google and synchronized favorites to Firestore.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);
    setLoading(true);

    try {
      if (mode === 'reset') {
        if (!email.trim()) throw new Error('Please enter your account email address.');
        await recoverPassword(email.trim());
        setInfoMsg('Password reset instructions have been sent to your email address.');
      } else if (mode === 'register') {
        if (!email.trim() || password.length < 6) {
          throw new Error('Please provide a valid email and a password of at least 6 characters.');
        }
        const user = await registerWithEmail(email.trim(), password, displayName.trim());
        if (user.emailVerified) {
          await onAuthSuccessMigrateGuest(user, mergeGuestData);
        } else {
          setInfoMsg(
            'Account created! A verification link has been sent to your email. Verify your email (or sign in with Google) to enable Firestore cloud write sync.'
          );
        }
      } else {
        if (!email.trim() || !password) {
          throw new Error('Please enter both your email and password.');
        }
        const user = await loginWithEmail(email.trim(), password);
        if (user.emailVerified) {
          await onAuthSuccessMigrateGuest(user, mergeGuestData);
          setInfoMsg('Signed in and synchronized preferences with Firestore.');
        } else {
          setInfoMsg(
            'Signed in! Please verify your email address (or use Google Sign-In) to unlock Firestore cloud writes.'
          );
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication operation failed.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await logoutFirebase();
      setInfoMsg('Signed out. You are now browsing in Guest Mode with local persistence.');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Sign-out error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="glass-panel w-full max-w-lg p-6 sm:p-8 border border-white/15 relative space-y-6">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#E10600] font-bold flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5" />
              <span>Firebase Authentication &amp; Cloud Sync</span>
            </span>
            <h2 id="auth-modal-title" className="text-2xl sm:text-3xl font-heading mt-1">
              {currentUser ? 'F1 Paddock Cloud Account' : 'Sign In or Continue as Guest'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close authentication modal"
            className="p-2 rounded-lg bg-white/10 hover:bg-[#E10600] text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-lg bg-red-500/15 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#E10600]" />
            <span>{errorMsg}</span>
          </div>
        )}

        {infoMsg && (
          <div className="p-3.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span>{infoMsg}</span>
          </div>
        )}

        {currentUser ? (
          <div className="space-y-5">
            <div className="glass-panel p-5 border-l-4 border-l-emerald-400 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  <span>Authenticated Session</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-300">
                  {currentUser.emailVerified ? 'Verified Email' : 'Verification Pending'}
                </span>
              </div>
              <p className="text-lg font-heading text-white">
                {currentUser.displayName || 'F1 Paddock Member'}
              </p>
              <p className="text-xs text-gray-400">{currentUser.email}</p>
              <p className="text-xs text-gray-300 pt-2 border-t border-white/10">
                Cloud Status:{' '}
                <strong className="text-emerald-400 uppercase">{cloudSyncStatus}</strong>
                {cloudSyncMessage ? ` — ${cloudSyncMessage}` : ''}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={onManualSyncNow}
                className="flex-1 px-4 py-2.5 rounded-lg bg-[#E10600] hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Cloud className="w-4 h-4" />
                <span>Sync Favorites to Cloud Now</span>
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Mode Switcher */}
            <div className="grid grid-cols-3 gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                  setInfoMsg(null);
                }}
                className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  mode === 'login' ? 'bg-[#E10600] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg(null);
                  setInfoMsg(null);
                }}
                className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  mode === 'register' ? 'bg-[#E10600] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('reset');
                  setErrorMsg(null);
                  setInfoMsg(null);
                }}
                className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  mode === 'reset' ? 'bg-[#E10600] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Recover</span>
              </button>
            </div>

            {/* Google Sign-In Button */}
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 rounded-xl bg-white text-black hover:bg-gray-200 font-bold text-xs flex items-center justify-center gap-2.5 transition-colors shadow-lg"
            >
              <ShieldCheck className="w-4 h-4 text-[#E10600]" />
              <span>Continue with Google (Instant Verified Cloud Sync)</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-white/10" />
              <span className="flex-shrink mx-3 text-[11px] uppercase text-gray-500">
                Or Email Credentials
              </span>
              <div className="flex-grow border-t border-white/10" />
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs text-gray-400 uppercase mb-1">
                    Paddock Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g., Tifosi Strategist"
                    className="w-full bg-[#0D1117] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:border-[#E10600] outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs text-gray-400 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="driver@f1paddock.com"
                  className="w-full bg-[#0D1117] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:border-[#E10600] outline-none"
                />
              </div>

              {mode !== 'reset' && (
                <div>
                  <label className="block text-xs text-gray-400 uppercase mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#0D1117] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:border-[#E10600] outline-none"
                  />
                </div>
              )}

              {/* Guest-to-Account Migration Option */}
              {mode !== 'reset' && (
                <label className="flex items-start gap-2.5 p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer text-xs text-gray-300">
                  <input
                    type="checkbox"
                    checked={mergeGuestData}
                    onChange={(e) => setMergeGuestData(e.target.checked)}
                    className="mt-0.5 accent-[#E10600]"
                  />
                  <span>
                    <strong>Migrate Guest Mode Data:</strong> Merge my {guestDriversCount} local
                    favorite drivers and {guestTeamsCount} favorite constructors into my cloud
                    account upon sign-in.
                  </span>
                </label>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#E10600] hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                {loading
                  ? 'Processing...'
                  : mode === 'login'
                  ? 'Sign In & Sync Cloud Profile'
                  : mode === 'register'
                  ? 'Create F1 Hub Cloud Account'
                  : 'Send Password Recovery Email'}
              </button>
            </form>

            {/* Explicit Guest Mode Button */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-4">
              <p className="text-[11px] text-gray-400">
                Prefer not to sign in? Guest Mode saves your favorites locally in this browser.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white font-bold whitespace-nowrap shrink-0 transition-colors"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
