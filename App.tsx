import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserCircle,
  Calendar as CalendarIcon,
  Map as MapIcon,
  Zap,
  Trophy,
  History,
  Crown,
  Cpu,
  Heart,
  Settings as SettingsIcon,
  Menu,
  X,
  Search,
  ChevronRight,
  CheckCircle2,
  RefreshCw,
  Award,
  Flag,
  Info,
  Cloud,
  LogIn,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  DRIVERS_DATA,
  TEAMS_2026,
  HISTORICAL_LEGENDS,
  DriverProfile,
  TeamProfile,
  getDriverSeasonStats,
  getDriverCareerStats,
  getSeasonStandingsTable,
  mapJolpicaStandingsResponse,
  formatStatValue,
  calculateHistoricalPoints,
  StandingsRow,
} from './utils/f1StatsEngine';
import {
  CALENDAR_2026,
  CIRCUITS_DATA,
  ACADEMY_MODULES,
  TECH_SYSTEMS,
  F1_LEARNING_HUB_TOPICS,
  F1_ACADEMY_CALENDAR_2026,
  CircuitProfile,
} from './data/f1UniverseData';
import {
  getDriverExtendedMetadata,
  TEAM_GOVERNANCE_AND_MEDIA,
  CIRCUIT_EXTENDED_PROFILES,
  CAR_COMPONENTS_2026,
  F1_ACADEMY_SERIES_DRIVERS,
  F1AcademySeriesProfile,
  LEWIS_HAMILTON_HALL_OF_FAME,
} from './data/f1MediaAndProfiles';
import { DriverModal, TeamModal, CircuitModal, F1AcademyDriverModal } from './components/ProfileModals';
import { VerifiedMediaImage } from './components/VerifiedMediaImage';
import { GeminiAssistant } from './components/GeminiAssistant';
import { AuthModal } from './components/AuthModal';
import { AnimatedF1CarExplorer } from './components/AnimatedF1CarExplorer';
import {
  auth,
  db,
  doc,
  onAuthStateChanged,
  onSnapshot,
  saveUserPreferencesToCloud,
  User,
} from './services/firebaseClient';

type SectionId =
  | 'home'
  | 'learn'
  | 'teams'
  | 'drivers'
  | 'calendar'
  | 'circuits'
  | 'live'
  | 'standings'
  | 'timemachine'
  | 'halloffame'
  | 'technology'
  | 'favorites'
  | 'settings';

interface UserPreferences {
  favorites: {
    drivers: string[];
    teams: string[];
  };
  units: 'metric' | 'imperial';
  defaultStatsTab: 'both' | 'season' | 'career';
}

const DEFAULT_PREFS: UserPreferences = {
  favorites: {
    drivers: ['antonelli', 'hamilton', 'verstappen'],
    teams: ['mercedes', 'ferrari'],
  },
  units: 'metric',
  defaultStatsTab: 'both',
};

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [selectedSeason, setSelectedSeason] = useState<number>(2026);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Driver, Team, Circuit & F1 Academy Modal states
  const [flippingDriverId, setFlippingDriverId] = useState<string | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedCircuitId, setSelectedCircuitId] = useState<string | null>(null);
  const [selectedAcademyDriver, setSelectedAcademyDriver] = useState<F1AcademySeriesProfile | null>(null);

  // Firebase Auth & Cloud Sync State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'guest' | 'synced' | 'syncing' | 'error'>('guest');
  const [cloudSyncMessage, setCloudSyncMessage] = useState<string | null>(null);

  // Drivers Section Filters
  const [driverSearch, setDriverSearch] = useState<string>('');
  const [driverTeamFilter, setDriverTeamFilter] = useState<string>('all');
  const [driverSortBy, setDriverSortBy] = useState<'seasonPoints' | 'careerPoints' | 'careerWins'>('seasonPoints');

  // Standings Section State
  const [standingsTab, setStandingsTab] = useState<'drivers' | 'constructors'>('drivers');
  const [liveStandingsRows, setLiveStandingsRows] = useState<StandingsRow[]>(() =>
    getSeasonStandingsTable(2026)
  );
  const [standingsLoading, setStandingsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('18 Oct 2026, 21:55 UTC (Official FIA & Jolpica Sync)');
  const [apiNotice, setApiNotice] = useState<string | null>(null);

  // Time Machine State
  const [archiveYear, setArchiveYear] = useState<number>(2024);
  const [archiveRows, setArchiveRows] = useState<StandingsRow[]>(() => getSeasonStandingsTable(2024));
  const [archiveLoading, setArchiveLoading] = useState<boolean>(false);
  const [calcEraYear, setCalcEraYear] = useState<number>(2026);
  const [calcPosition, setCalcPosition] = useState<number>(1);
  const [calcIsSprint, setCalcIsSprint] = useState<boolean>(false);
  const [calcFastestLap, setCalcFastestLap] = useState<boolean>(false);

  // Live Race Telemetry Simulation State
  const [selectedTelemetryDriver, setSelectedTelemetryDriver] = useState<string>('antonelli');
  const [aeroMode, setAeroMode] = useState<'Z-Mode (High Downforce)' | 'X-Mode (Low Drag)'>('Z-Mode (High Downforce)');

  // F1 Academy & 20-Topic Learning Hub State
  const [expandedModuleId, setExpandedModuleId] = useState<string>('mod-1');
  const [learningCategoryFilter, setLearningCategoryFilter] = useState<string>('all');
  const [learningSearch, setLearningSearch] = useState<string>('');
  const [expandedTopicId, setExpandedTopicId] = useState<string>('topic-1');

  // Interactive 2026 Car Engineering Explorer State
  const [selectedComponentId, setSelectedComponentId] = useState<string>(CAR_COMPONENTS_2026[0].id);
  const [showComponentDeepDive, setShowComponentDeepDive] = useState<boolean>(true);

  // User Preferences in localStorage (Guest Mode default + Cloud Sync)
  const [prefs, setPrefs] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('f1_hub_prefs_v2');
      return saved ? JSON.parse(saved) : DEFAULT_PREFS;
    } catch {
      return DEFAULT_PREFS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('f1_hub_prefs_v2', JSON.stringify(prefs));
    } catch {
      // ignore local storage errors
    }
  }, [prefs]);

  // Listen to Firebase Auth State & Real-Time Firestore Preferences Document
  useEffect(() => {
    let unsubFirestore: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (unsubFirestore) {
        unsubFirestore();
        unsubFirestore = null;
      }

      if (!user) {
        setCloudSyncStatus('guest');
        setCloudSyncMessage('Guest Mode (Local Storage Active)');
        return;
      }

      setCloudSyncStatus('syncing');
      const userDocRef = doc(db, 'users', user.uid);
      unsubFirestore = onSnapshot(
        userDocRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setPrefs((prev) => ({
              ...prev,
              favorites: {
                drivers: Array.isArray(data.favoriteDrivers) ? data.favoriteDrivers : prev.favorites.drivers,
                teams: Array.isArray(data.favoriteTeams) ? data.favoriteTeams : prev.favorites.teams,
              },
              units: data.units === 'imperial' ? 'imperial' : 'metric',
            }));
            setCloudSyncStatus('synced');
            setCloudSyncMessage('Synchronized with Firestore Cloud');
          } else {
            setCloudSyncStatus(user.emailVerified ? 'synced' : 'guest');
            setCloudSyncMessage(
              user.emailVerified ? 'Cloud Profile Ready' : 'Verify email to enable Cloud Writes'
            );
          }
        },
        () => {
          setCloudSyncStatus('error');
          setCloudSyncMessage('Using local cache');
        }
      );
    });

    return () => {
      unsubAuth();
      if (unsubFirestore) unsubFirestore();
    };
  }, []);

  const syncPrefsToCloudIfAuthenticated = async (
    nextPrefs: UserPreferences,
    userOverride?: User | null,
    mergeGuest = false
  ) => {
    const activeUser = userOverride ?? currentUser;
    if (!activeUser || !activeUser.emailVerified) return;
    setCloudSyncStatus('syncing');
    try {
      await saveUserPreferencesToCloud(
        activeUser,
        {
          favoriteDrivers: nextPrefs.favorites.drivers,
          favoriteTeams: nextPrefs.favorites.teams,
          units: nextPrefs.units,
          defaultSeason: selectedSeason,
        },
        mergeGuest
      );
      setCloudSyncStatus('synced');
      setCloudSyncMessage('Saved to Firestore Cloud');
    } catch (err: unknown) {
      setCloudSyncStatus('error');
      setCloudSyncMessage(err instanceof Error ? err.message : 'Cloud write error');
    }
  };

  // Trigger 3D Card Flip Animation before opening full-screen Driver Profile
  const handleDriverCardClick = (driverId: string) => {
    setFlippingDriverId(driverId);
    window.setTimeout(() => {
      setSelectedDriverId(driverId);
      setFlippingDriverId(null);
    }, 220);
  };

  // Fetch or reconcile standings when selectedSeason changes
  useEffect(() => {
    let cancelled = false;
    async function loadSeasonStandings(year: number) {
      if (year === 2026 || year === 2025) {
        setLiveStandingsRows(getSeasonStandingsTable(year));
        setApiNotice(null);
        setLastUpdated(`18 Oct 2026 • Official F1 ${year} Verified Dataset`);
        return;
      }

      setStandingsLoading(true);
      setApiNotice(null);
      try {
        const res = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/driverStandings.json`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list = data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings;
        if (!cancelled) {
          if (Array.isArray(list) && list.length > 0) {
            setLiveStandingsRows(mapJolpicaStandingsResponse(list, year));
            setLastUpdated(`Live Jolpica-F1 API Sync (${year} Season)`);
          } else {
            setLiveStandingsRows(getSeasonStandingsTable(year));
            setApiNotice(`Showing verified internal archive for ${year}.`);
          }
        }
      } catch {
        if (!cancelled) {
          setLiveStandingsRows(getSeasonStandingsTable(year));
          setApiNotice(
            `External Jolpica API unreachable; displaying verified ${year} championship dataset without zeroing out records.`
          );
        }
      } finally {
        if (!cancelled) setStandingsLoading(false);
      }
    }

    loadSeasonStandings(selectedSeason);
    return () => {
      cancelled = true;
    };
  }, [selectedSeason]);

  // Time Machine Historical Fetch
  useEffect(() => {
    let cancelled = false;
    async function loadArchive(year: number) {
      if (year === 2026 || year === 2025) {
        setArchiveRows(getSeasonStandingsTable(year));
        return;
      }
      setArchiveLoading(true);
      try {
        const res = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/driverStandings.json`);
        if (!res.ok) throw new Error('Archive fetch failed');
        const data = await res.json();
        const list = data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings;
        if (!cancelled) {
          if (Array.isArray(list) && list.length > 0) {
            setArchiveRows(mapJolpicaStandingsResponse(list, year));
          } else {
            setArchiveRows(getSeasonStandingsTable(year));
          }
        }
      } catch {
        if (!cancelled) {
          setArchiveRows(getSeasonStandingsTable(year));
        }
      } finally {
        if (!cancelled) setArchiveLoading(false);
      }
    }
    loadArchive(archiveYear);
    return () => {
      cancelled = true;
    };
  }, [archiveYear]);

  const toggleFavoriteDriver = (driverId: string) => {
    setPrefs((prev) => {
      const exists = prev.favorites.drivers.includes(driverId);
      const next: UserPreferences = {
        ...prev,
        favorites: {
          ...prev.favorites,
          drivers: exists
            ? prev.favorites.drivers.filter((id) => id !== driverId)
            : [...prev.favorites.drivers, driverId],
        },
      };
      void syncPrefsToCloudIfAuthenticated(next);
      return next;
    });
  };

  const toggleFavoriteTeam = (teamId: string) => {
    setPrefs((prev) => {
      const exists = prev.favorites.teams.includes(teamId);
      const next: UserPreferences = {
        ...prev,
        favorites: {
          ...prev.favorites,
          teams: exists
            ? prev.favorites.teams.filter((id) => id !== teamId)
            : [...prev.favorites.teams, teamId],
        },
      };
      void syncPrefsToCloudIfAuthenticated(next);
      return next;
    });
  };

  const selectedDriverModalObj: DriverProfile | null = useMemo(
    () => (selectedDriverId ? DRIVERS_DATA.find((d) => d.id === selectedDriverId) ?? null : null),
    [selectedDriverId]
  );

  const selectedTeamModalObj: TeamProfile | null = useMemo(
    () => (selectedTeamId ? TEAMS_2026.find((t) => t.id === selectedTeamId) ?? null : null),
    [selectedTeamId]
  );

  const selectedCircuitModalObj: CircuitProfile | null = useMemo(
    () => (selectedCircuitId ? CIRCUITS_DATA.find((c) => c.id === selectedCircuitId) ?? null : null),
    [selectedCircuitId]
  );

  const activeCarComponent = useMemo(
    () => CAR_COMPONENTS_2026.find((c) => c.id === selectedComponentId) || CAR_COMPONENTS_2026[0],
    [selectedComponentId]
  );

  // Filtered and Sorted Drivers
  const filteredDrivers = useMemo(() => {
    return DRIVERS_DATA.filter((d) => {
      const matchesTeam = driverTeamFilter === 'all' || d.currentTeamId === driverTeamFilter;
      const query = driverSearch.trim().toLowerCase();
      const matchesQuery =
        !query ||
        d.fullName.toLowerCase().includes(query) ||
        d.lastName.toLowerCase().includes(query) ||
        d.code.toLowerCase().includes(query) ||
        d.nationality.toLowerCase().includes(query);
      return matchesTeam && matchesQuery;
    }).sort((a, b) => {
      if (driverSortBy === 'careerPoints') {
        return (b.career.points ?? 0) - (a.career.points ?? 0);
      }
      if (driverSortBy === 'careerWins') {
        return (b.career.gpWins ?? 0) - (a.career.gpWins ?? 0);
      }
      const ptsA = a.seasons[selectedSeason]?.points ?? -1;
      const ptsB = b.seasons[selectedSeason]?.points ?? -1;
      return ptsB - ptsA;
    });
  }, [driverSearch, driverTeamFilter, driverSortBy, selectedSeason]);

  const filteredLearningTopics = useMemo(() => {
    return F1_LEARNING_HUB_TOPICS.filter((t) => {
      const matchesCat = learningCategoryFilter === 'all' || t.category === learningCategoryFilter;
      const q = learningSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.technicalDeepDive.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [learningCategoryFilter, learningSearch]);

  const championshipLeader = DRIVERS_DATA[0]; // Kimi Antonelli
  const leaderSeason2026 = getDriverSeasonStats('antonelli', 2026);
  const leaderCareer = getDriverCareerStats('antonelli');

  const navigateTo = (section: SectionId) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navGroups: Array<{
    groupLabel: string;
    items: Array<{ id: SectionId; label: string; icon: React.ReactNode }>;
  }> = [
    {
      groupLabel: 'Main Universe',
      items: [
        { id: 'home', label: 'Command Centre', icon: <LayoutDashboard className="w-5 h-5" /> },
        { id: 'drivers', label: 'The Drivers', icon: <UserCircle className="w-5 h-5" /> },
        { id: 'teams', label: 'The Constructors', icon: <Users className="w-5 h-5" /> },
        { id: 'standings', label: 'Standings', icon: <Trophy className="w-5 h-5" /> },
        { id: 'calendar', label: '2026 Calendar', icon: <CalendarIcon className="w-5 h-5" /> },
        { id: 'circuits', label: 'Circuits', icon: <MapIcon className="w-5 h-5" /> },
      ],
    },
    {
      groupLabel: 'Data & Heritage',
      items: [
        { id: 'live', label: 'Live Race Center', icon: <Zap className="w-5 h-5" /> },
        { id: 'timemachine', label: 'Time Machine', icon: <History className="w-5 h-5" /> },
        { id: 'halloffame', label: 'Hall of Fame', icon: <Crown className="w-5 h-5" /> },
        { id: 'learn', label: 'F1 Academy', icon: <GraduationCap className="w-5 h-5" /> },
        { id: 'technology', label: 'F1 Technology', icon: <Cpu className="w-5 h-5" /> },
      ],
    },
    {
      groupLabel: 'Personal Hub',
      items: [
        { id: 'favorites', label: 'Favorites', icon: <Heart className="w-5 h-5" /> },
        { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-5 h-5" /> },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Desktop & Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-72 glass-sidebar z-40 transition-transform duration-300 overflow-y-auto ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Primary Navigation"
      >
        <div className="p-6 sm:p-7">
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="flex items-center gap-3 text-left"
            >
              <div className="w-9 h-9 bg-[#E10600] flex items-center justify-center rounded-sm shrink-0">
                <span className="font-heading font-black text-white italic text-lg">F1</span>
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold tracking-tight text-white">
                  ULTIMATE F1 HUB
                </h1>
                <p className="text-[11px] text-gray-400 uppercase tracking-widest">
                  Editorial &amp; Telemetry
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="lg:hidden p-1.5 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Global Active Season Selector */}
          <div className="mb-4 p-3.5 rounded-xl f1-glass-inset">
            <label
              htmlFor="global-season-selector"
              className="block text-[11px] uppercase tracking-wider text-gray-300 mb-1.5"
            >
              Active Championship Season
            </label>
            <select
              id="global-season-selector"
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(Number(e.target.value))}
              className="w-full f1-glass-control rounded-lg px-3 py-2 text-sm text-white focus:border-[#E10600] outline-none"
            >
              <option value={2026}>2026 Season (Active)</option>
              <option value={2025}>2025 Season Archive</option>
              <option value={2024}>2024 Season Archive</option>
            </select>
          </div>

          {/* Cloud Account / Guest Mode Pill */}
          <button
            type="button"
            onClick={() => setAuthModalOpen(true)}
            data-testid="sidebar-auth-button"
            className="w-full mb-6 p-3 rounded-xl f1-glass-inset hover:bg-white/[0.1] flex items-center justify-between text-left transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Cloud
                className={`w-4 h-4 shrink-0 ${
                  currentUser ? 'text-emerald-400' : 'text-[#E10600]'
                }`}
              />
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">
                  {currentUser
                    ? currentUser.displayName || currentUser.email
                    : 'Guest Mode Active'}
                </p>
                <p className="text-[10px] text-gray-300 truncate">
                  {currentUser ? 'Cloud Sync Connected' : 'Sign In for Cloud Sync'}
                </p>
              </div>
            </div>
            <LogIn className="w-3.5 h-3.5 text-gray-300 shrink-0" />
          </button>

          <nav className="space-y-6">
            {navGroups.map((group) => (
              <div key={group.groupLabel}>
                <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400 mb-2.5 px-3">
                  {group.groupLabel}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        data-testid={`nav-${item.id}`}
                        onClick={() => navigateTo(item.id)}
                        className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-r-lg text-left transition-all ${
                          isActive
                            ? 'nav-link-active font-bold'
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {item.icon}
                        <span className="nav-label text-base">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 w-full glass-panel z-30 px-5 py-3.5 flex justify-between items-center rounded-none border-x-0 border-t-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#E10600] flex items-center justify-center rounded-sm">
            <span className="font-heading font-black text-white italic text-xs">F1</span>
          </div>
          <span className="font-heading text-base font-bold">ULTIMATE F1 HUB</span>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setAuthModalOpen(true)}
            aria-label="Open Cloud Account and Guest Mode settings"
            className="px-2.5 py-1 rounded bg-white/10 text-xs text-white flex items-center gap-1"
          >
            <Cloud className="w-3.5 h-3.5 text-[#E10600]" />
            <span>{currentUser ? 'Cloud' : 'Guest'}</span>
          </button>
          <select
            aria-label="Mobile Season Selector"
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(Number(e.target.value))}
            className="bg-[#0D1117] border border-white/20 rounded px-2 py-1 text-xs text-white"
          >
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
            <option value={2024}>2024</option>
          </select>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="p-2 text-white bg-white/5 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="lg:ml-72 flex-1 min-h-screen p-5 sm:p-8 lg:p-12 track-pattern">
        <div className="max-w-7xl mx-auto pb-24">
          {/* Top Data Integrity & Cloud Sync Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-white/10 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Data Pipeline Verified: Career Totals, {selectedSeason} Season Results &amp; Sprint Points Strictly Separated
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span>Last Updated: {lastUpdated}</span>
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white flex items-center gap-1.5 transition-colors"
              >
                <Cloud className="w-3.5 h-3.5 text-[#E10600]" />
                <span>
                  {currentUser
                    ? `Signed In (${currentUser.email})`
                    : 'Guest Mode • Sign In / Sync'}
                </span>
              </button>
            </div>
          </div>

          {/* ================= HOME / COMMAND CENTRE ================= */}
          {activeSection === 'home' && (
            <div className="space-y-12">
              <section className="glass-panel p-8 sm:p-12 relative overflow-hidden border-l-4 border-l-[#E10600]">
                <p className="text-[#E10600] uppercase tracking-[0.2em] text-xs font-bold mb-3">
                  THE {selectedSeason} FORMULA 1 UNIVERSE • EDITORIAL EDITION
                </p>
                <h1 className="text-4xl sm:text-6xl font-heading font-bold leading-tight mb-5">
                  Welcome to the Complete World of Formula 1
                </h1>
                <p className="text-gray-300 max-w-3xl text-lg leading-relaxed mb-8">
                  Experience the pinnacle of motorsport with verified championship statistics, Wikimedia-licensed photography, interactive SVG circuits, and 2026 car anatomy. Explore the 11-team 2026 grid featuring Audi and Cadillac, track Kimi Antonelli’s championship-leading campaign for Mercedes-AMG, and witness Sir Lewis Hamilton’s historic pursuit with Scuderia Ferrari.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={() => navigateTo('drivers')}
                    className="bg-[#E10600] hover:bg-red-700 text-white px-7 py-3.5 rounded-lg font-bold transition-all"
                  >
                    Explore Verified Driver Profiles
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo('standings')}
                    className="bg-white/5 hover:bg-white/10 border border-white/20 text-white px-7 py-3.5 rounded-lg font-bold transition-all"
                  >
                    View {selectedSeason} Standings
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDriverId('antonelli')}
                    className="bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-200 px-6 py-3.5 rounded-lg font-bold transition-all"
                  >
                    Inspect Kimi Antonelli Profile
                  </button>
                </div>
              </section>

              {/* Spotlight: 2026 Championship Leader vs Career Totals */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-panel p-8 border-t-4 border-t-[#27F4D2]">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-[#27F4D2] block">
                        2026 World Drivers’ Championship Leader
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-heading mt-1">
                        {championshipLeader.firstName} {championshipLeader.lastName}
                      </h2>
                      <p className="text-sm text-gray-400">
                        Mercedes-AMG PETRONAS • Car #{championshipLeader.number}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedDriverId('antonelli')}
                      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-[#E10600] text-sm transition-colors flex items-center gap-2"
                    >
                      <span>Full Statistical Audit</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/10">
                    {/* 2026 Season Column */}
                    <div className="bg-white/[0.03] p-5 rounded-xl border border-white/10">
                      <p className="text-xs uppercase tracking-wider text-[#E10600] font-bold mb-3">
                        2026 Season Statistics (Current Season)
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs text-gray-400 block">2026 Season Points</span>
                          <span className="text-3xl stat-value text-[#E10600]" data-testid="home-antonelli-season-points">
                            {leaderSeason2026.points}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-400 block">2026 GP Wins</span>
                          <span className="text-3xl stat-value text-white" data-testid="home-antonelli-season-wins">
                            {leaderSeason2026.gpWins}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-400 block">2026 GP Podiums</span>
                          <span className="text-2xl stat-value text-white" data-testid="home-antonelli-season-podiums">
                            {leaderSeason2026.gpPodiums}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-400 block">2026 GP Poles</span>
                          <span className="text-2xl stat-value text-white" data-testid="home-antonelli-season-poles">
                            {leaderSeason2026.gpPoles}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Career Totals Column */}
                    <div className="bg-white/[0.03] p-5 rounded-xl border border-white/10">
                      <p className="text-xs uppercase tracking-wider text-emerald-400 font-bold mb-3">
                        Career Statistics (Lifetime Accumulated)
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs text-gray-400 block">Career Points</span>
                          <span className="text-3xl stat-value text-emerald-400" data-testid="home-antonelli-career-points">
                            {leaderCareer.points}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-400 block">Career GP Podiums</span>
                          <span className="text-3xl stat-value text-white" data-testid="home-antonelli-career-podiums">
                            {leaderCareer.gpPodiums}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-400 block">Career GP Entries</span>
                          <span className="text-2xl stat-value text-white" data-testid="home-antonelli-career-entries">
                            {leaderCareer.gpEntries}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-400 block">Career Poles / Titles</span>
                          <span className="text-2xl stat-value text-white">
                            {leaderCareer.gpPoles} / {leaderCareer.worldChampionships}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Grand Prix & Quick Facts */}
                <div className="glass-panel p-8 flex flex-col justify-between border-t-4 border-t-[#E10600]">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-gray-400 block">
                      Next Championship Round • Round 18
                    </span>
                    <h2 className="text-3xl font-heading mt-1">Mexico City Grand Prix</h2>
                    <div className="f1-divider my-4" />
                    <p className="text-gray-300 text-base">
                      Autódromo Hermanos Rodríguez • 23–25 Oct 2026
                    </p>
                    <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                      At 2,285 metres above sea level, Mexico City tests 2026 turbocharger compressor efficiency and active X-Mode cooling down the 1.2 km main straight.
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 block">2026 Grid Size</span>
                      <span className="text-xl stat-value">11 Teams • 22 Drivers</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigateTo('calendar')}
                      className="text-sm text-[#E10600] hover:underline flex items-center gap-1"
                    >
                      <span>Full Calendar</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Top 6 Championship Contenders Quick Overview */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-heading">
                      {selectedSeason} Championship Front-Runners
                    </h2>
                    <p className="text-sm text-gray-400">
                      Side-by-side comparison of {selectedSeason} Season statistics and Career totals
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateTo('drivers')}
                    className="text-sm text-[#E10600] hover:underline flex items-center gap-1"
                  >
                    <span>View All 22 Drivers</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-1000">
                  {DRIVERS_DATA.slice(0, 6).map((d) => {
                    const s = getDriverSeasonStats(d.id, selectedSeason);
                    const c = getDriverCareerStats(d.id);
                    const team = TEAMS_2026.find((t) => t.id === d.currentTeamId) || TEAMS_2026[0];
                    const ext = getDriverExtendedMetadata(d.id, d.fullName, d.currentTeamId);
                    const isFlipping = flippingDriverId === d.id;
                    return (
                      <div
                        key={d.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleDriverCardClick(d.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleDriverCardClick(d.id);
                          }
                        }}
                        className={`group relative h-[460px] rounded-2xl glass-panel glass-panel-interactive driver-card-3d overflow-hidden cursor-pointer flex flex-col justify-between border-t-4 ${
                          isFlipping ? 'driver-card-flipping' : ''
                        }`}
                        style={{ borderTopColor: team.color }}
                      >
                        {/* Full-Bleed Portrait Photograph — Unobscured Face */}
                        <div className="absolute inset-0 z-0 bg-[#07090D]">
                          <VerifiedMediaImage
                            media={ext.media}
                            alt={d.fullName}
                            accentColor={team.color}
                            badgeText={`#${d.number} ${d.code}`}
                            fallbackType="driver"
                            objectPosition={ext.objectPosition || 'center 16%'}
                            className="w-full h-full"
                            imgClassName="object-cover transition-transform duration-700 group-hover:scale-105"
                            showAttributionBar={false}
                            gradientOverlayClassName="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#05070B] via-[#07090F]/70 to-transparent pointer-events-none"
                          />
                        </div>

                        {/* Minimal Top Corner Badges (Never Over Face) */}
                        <div className="relative z-10 p-4 flex justify-between items-start pointer-events-none">
                          <span
                            className="px-2.5 py-1 rounded-md text-xs font-bold text-black shadow-lg"
                            style={{ backgroundColor: team.color }}
                          >
                            {s.position ? `P${s.position}` : 'N/A'} • #{d.number}
                          </span>
                          <span className="f1-glass-pill px-2.5 py-1 rounded-md text-xs text-gray-100 font-medium">
                            {d.countryCode}
                          </span>
                        </div>

                        {/* Compact Editorial Bottom Identity Strip — Click to Open Full Glass Profile */}
                        <div className="relative z-10 p-5 pt-0 mt-auto">
                          <div className="flex justify-between items-end gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 text-xs text-gray-200 font-medium">
                                <span
                                  className="w-2 h-2 rounded-full shrink-0"
                                  style={{ backgroundColor: team.color }}
                                />
                                <span className="truncate">{team.name}</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-300">{d.nationality}</span>
                              </div>
                              <h3 className="text-2xl sm:text-3xl font-heading driver-name text-white mt-0.5 truncate">
                                {d.firstName} {d.lastName}
                              </h3>
                            </div>
                            <span
                              className="text-3xl sm:text-4xl font-heading font-black italic shrink-0"
                              style={{ color: team.color }}
                            >
                              #{d.number}
                            </span>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3 text-gray-200">
                              <span>
                                {selectedSeason}: <strong className="text-[#E10600] stat-value">{formatStatValue(s.points)} pts</strong>
                              </span>
                              <span className="text-white/30">•</span>
                              <span>
                                Career: <strong className="text-emerald-400 stat-value">{formatStatValue(c.gpWins)} wins</strong>
                              </span>
                            </div>
                            <span className="inline-flex items-center gap-1 font-bold text-white group-hover:text-[#E10600] transition-colors">
                              <span>Open Profile</span>
                              <ChevronRight className="w-3.5 h-3.5 text-[#E10600]" />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          )}

          {/* ================= DRIVERS GRID SECTION ================= */}
          {activeSection === 'drivers' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#E10600] font-bold">
                    OFFICIAL DRIVER PROFILES, VERIFIED PHOTOGRAPHS &amp; CAREER AUDIT
                  </p>
                  <h1 className="text-4xl sm:text-5xl font-heading mt-1">
                    The {selectedSeason} Formula 1 Drivers
                  </h1>
                  <p className="text-gray-300 text-sm mt-1">
                    Every driver card features full-bleed Wikimedia-licensed racing photography with translucent frosted glass overlays and strictly separated {selectedSeason} Season statistics, Career totals, and Sprint statistics. Click any card for a 3D flip into the full-screen profile dossier.
                  </p>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="f1-glass-panel rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={driverSearch}
                    onChange={(e) => setDriverSearch(e.target.value)}
                    placeholder="Search driver name, code, or nationality..."
                    aria-label="Search drivers"
                    className="w-full f1-glass-control rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:border-[#E10600] outline-none"
                  />
                </div>

                <div>
                  <select
                    aria-label="Filter drivers by constructor"
                    value={driverTeamFilter}
                    onChange={(e) => setDriverTeamFilter(e.target.value)}
                    className="w-full f1-glass-control rounded-lg px-3.5 py-2.5 text-sm text-white focus:border-[#E10600] outline-none"
                  >
                    <option value="all">All 11 Constructors</option>
                    {TEAMS_2026.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    aria-label="Sort drivers by metric"
                    value={driverSortBy}
                    onChange={(e) =>
                      setDriverSortBy(
                        e.target.value as 'seasonPoints' | 'careerPoints' | 'careerWins'
                      )
                    }
                    className="w-full f1-glass-control rounded-lg px-3.5 py-2.5 text-sm text-white focus:border-[#E10600] outline-none"
                  >
                    <option value="seasonPoints">Sort by {selectedSeason} Season Points</option>
                    <option value="careerPoints">Sort by Lifetime Career Points</option>
                    <option value="careerWins">Sort by Lifetime Career GP Wins</option>
                  </select>
                </div>
              </div>

              {/* Drivers Cards Grid — Portrait-First Editorial Cards (Unobscured Face on First View, Full Glass Profile on Click) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 perspective-1000">
                {filteredDrivers.map((d) => {
                  const s = getDriverSeasonStats(d.id, selectedSeason);
                  const c = getDriverCareerStats(d.id);
                  const team = TEAMS_2026.find((t) => t.id === d.currentTeamId) || TEAMS_2026[0];
                  const ext = getDriverExtendedMetadata(d.id, d.fullName, d.currentTeamId);
                  const isFlipping = flippingDriverId === d.id;
                  const isFav = prefs.favorites.drivers.includes(d.id);
                  return (
                    <article
                      key={d.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`Open full profile for ${d.fullName}`}
                      data-testid={`driver-card-${d.id}`}
                      onClick={() => handleDriverCardClick(d.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleDriverCardClick(d.id);
                        }
                      }}
                      className={`group relative h-[490px] rounded-2xl glass-panel glass-panel-interactive driver-card-3d overflow-hidden cursor-pointer flex flex-col justify-between border-t-4 ${
                        isFlipping ? 'driver-card-flipping' : ''
                      }`}
                      style={{ borderTopColor: team.color }}
                    >
                      {/* Full-Bleed Driver Portrait Background — Image-Aware Cropping so Face, Eyes & Expression Are 100% Unobscured */}
                      <div className="absolute inset-0 z-0 bg-[#07090D]">
                        <VerifiedMediaImage
                          media={ext.media}
                          alt={d.fullName}
                          accentColor={team.color}
                          badgeText={`#${d.number} ${d.code}`}
                          fallbackType="driver"
                          objectPosition={ext.objectPosition || 'center 16%'}
                          className="w-full h-full"
                          imgClassName="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          showAttributionBar={false}
                          gradientOverlayClassName="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#05070B] via-[#07090F]/72 to-transparent pointer-events-none"
                        />
                      </div>

                      {/* Minimal Top Corner Badges (Never Obscuring the Driver's Face) */}
                      <div className="relative z-10 p-4 flex items-start justify-between gap-2 pointer-events-none">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="px-3 py-1 rounded-md text-xs font-bold text-black shadow-lg"
                            style={{ backgroundColor: team.color }}
                          >
                            #{d.number} • {s.position !== null ? `P${s.position}` : '2026'}
                          </span>
                          {c.worldChampionships !== null && c.worldChampionships > 0 && (
                            <span className="px-2.5 py-1 bg-amber-500/30 backdrop-blur-md text-amber-200 rounded-md text-xs stat-value border border-amber-400/40">
                              {c.worldChampionships}x WDC
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          aria-label={`Favorite ${d.fullName}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavoriteDriver(d.id);
                          }}
                          className="pointer-events-auto p-2 rounded-full f1-glass-pill hover:bg-white/20 transition-colors cursor-pointer"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isFav ? 'fill-[#E10600] text-[#E10600]' : 'text-white'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Clean Editorial Bottom Identity Overlay — Name, Racing Number, Team, Nationality & Click-to-Reveal Cue */}
                      <div className="relative z-10 p-5 pt-0 mt-auto">
                        <div className="flex justify-between items-end gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 text-xs text-gray-200 font-medium">
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: team.color }}
                              />
                              <span className="truncate font-semibold">{team.name}</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-300">{d.nationality}</span>
                            </div>
                            <h2 className="text-3xl font-heading driver-name text-white mt-1 truncate">
                              {d.firstName} {d.lastName}
                            </h2>
                          </div>
                          <span
                            className="text-4xl font-heading font-black italic shrink-0"
                            style={{ color: team.color }}
                          >
                            #{d.number}
                          </span>
                        </div>

                        {/* Compact Click-to-Reveal Strip (Full Glassmorphism Profile Opens on Click) */}
                        <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-xs text-gray-200">
                          <div className="flex items-center gap-2.5">
                            <span>
                              {selectedSeason}: <strong className="text-[#E10600] stat-value">{formatStatValue(s.points)} pts</strong>
                            </span>
                            <span className="text-white/30">•</span>
                            <span>
                              Career: <strong className="text-emerald-400 stat-value">{formatStatValue(c.gpWins)} wins</strong>
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1 font-bold text-white group-hover:text-[#E10600] transition-colors">
                            <span>Reveal Glass Profile</span>
                            <ChevronRight className="w-4 h-4 text-[#E10600] group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= TEAMS / CONSTRUCTORS SECTION ================= */}
          {activeSection === 'teams' && (
            <div className="space-y-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#E10600] font-bold">
                  11 CONSTRUCTORS • CAR PHOTOGRAPHY &amp; GOVERNANCE SEPARATION
                </p>
                <h1 className="text-4xl sm:text-5xl font-heading mt-1">
                  Formula 1 Constructors Grid
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Featuring verified car photography and strictly separated Team Principal, CEO, Ownership Structure, Title Partner, and Headquarters for all 11 constructors.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {TEAMS_2026.map((team) => {
                  const lineup = DRIVERS_DATA.filter((d) => team.drivers.includes(d.id));
                  const gov = TEAM_GOVERNANCE_AND_MEDIA[team.id];
                  return (
                    <article
                      key={team.id}
                      data-testid={`team-card-${team.id}`}
                      onClick={() => setSelectedTeamId(team.id)}
                      className="glass-panel glass-panel-interactive overflow-hidden cursor-pointer flex flex-col justify-between border-t-4"
                      style={{ borderTopColor: team.color }}
                    >
                      {gov && (
                        <div className="h-44 relative overflow-hidden">
                          <VerifiedMediaImage
                            media={gov.carMedia}
                            alt={`${team.name} ${team.chassis2026}`}
                            accentColor={team.color}
                            badgeText={team.chassis2026}
                            fallbackType="car"
                            className="w-full h-full"
                          />
                        </div>
                      )}

                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs uppercase text-gray-400">
                              2026 Pos: P{team.season2026Position}
                            </span>
                            <span className="text-xs px-2.5 py-0.5 bg-white/10 rounded stat-value">
                              {team.worldChampionships} World Titles
                            </span>
                          </div>
                          <h2 className="text-2xl font-heading team-title">{team.name}</h2>

                          {/* Strictly Separated Governance Preview */}
                          <div className="mt-3 space-y-1 text-xs text-gray-300 bg-white/[0.03] p-3 rounded-lg border border-white/5">
                            <div className="flex justify-between gap-2">
                              <span className="text-gray-400">Team Principal:</span>
                              <span className="font-bold text-right">{gov?.teamPrincipal || team.principal}</span>
                            </div>
                            <div className="flex justify-between gap-2">
                              <span className="text-gray-400">CEO:</span>
                              <span className="text-right truncate max-w-[180px]">{gov?.ceo}</span>
                            </div>
                            <div className="flex justify-between gap-2">
                              <span className="text-gray-400">Title Partner:</span>
                              <span className="text-emerald-400 font-bold text-right">{gov?.titleSponsor}</span>
                            </div>
                            <div className="flex justify-between gap-2">
                              <span className="text-gray-400">HQ:</span>
                              <span className="text-right truncate max-w-[180px]">{team.base}</span>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-white/10">
                            <p className="text-xs uppercase text-gray-400 mb-2">2026 Driver Lineup</p>
                            <div className="grid grid-cols-2 gap-2">
                              {lineup.map((d) => (
                                <div
                                  key={d.id}
                                  className="bg-white/5 px-3 py-2 rounded-lg text-sm font-heading"
                                >
                                  #{d.number} {d.lastName}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-400 block">2026 Points</span>
                            <span className="stat-value text-base text-[#E10600]">
                              {team.season2026Points}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">2026 Wins</span>
                            <span className="stat-value text-base">{team.season2026Wins}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">All-Time Wins</span>
                            <span className="stat-value text-base">{team.careerWins}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= CHAMPIONSHIP STANDINGS SECTION ================= */}
          {activeSection === 'standings' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#E10600] font-bold">
                    OFFICIAL FIA WORLD CHAMPIONSHIP CLASSIFICATION
                  </p>
                  <h1 className="text-4xl sm:text-5xl font-heading mt-1">
                    {selectedSeason} Championship Standings
                  </h1>
                  <p className="text-sm text-gray-400 mt-1">
                    {selectedSeason} Season Points, Feature GP Points, Sprint Points, and Lifetime Career Reference columns are clearly distinguished.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex rounded-lg bg-white/5 p-1 border border-white/10">
                    <button
                      type="button"
                      onClick={() => setStandingsTab('drivers')}
                      className={`px-4 py-2 rounded-md text-sm transition-colors ${
                        standingsTab === 'drivers'
                          ? 'bg-[#E10600] text-white font-bold'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      Drivers’ Championship
                    </button>
                    <button
                      type="button"
                      onClick={() => setStandingsTab('constructors')}
                      className={`px-4 py-2 rounded-md text-sm transition-colors ${
                        standingsTab === 'constructors'
                          ? 'bg-[#E10600] text-white font-bold'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      Constructors’ Championship
                    </button>
                  </div>
                </div>
              </div>

              {apiNotice && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/15 text-xs text-gray-300 flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#E10600] shrink-0" />
                  <span>{apiNotice}</span>
                </div>
              )}

              {standingsLoading ? (
                <div className="glass-panel p-16 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-[#E10600] animate-spin mx-auto" />
                  <p className="text-lg font-heading">Synchronizing {selectedSeason} Standings...</p>
                </div>
              ) : standingsTab === 'drivers' ? (
                <div className="glass-panel overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm" data-testid="standings-drivers-table">
                      <thead className="bg-white/5 text-xs uppercase text-gray-400 border-b border-white/10">
                        <tr>
                          <th className="p-4">Pos</th>
                          <th className="p-4">Driver</th>
                          <th className="p-4">Constructor</th>
                          <th className="p-4 text-right">{selectedSeason} Pts</th>
                          <th className="p-4 text-right">{selectedSeason} GP Pts</th>
                          <th className="p-4 text-right">{selectedSeason} Sprint Pts</th>
                          <th className="p-4 text-right">{selectedSeason} Wins</th>
                          <th className="p-4 text-right">{selectedSeason} Podiums</th>
                          <th className="p-4 text-right">{selectedSeason} Poles</th>
                          <th className="p-4 text-right border-l border-white/10 text-emerald-400">
                            Career Pts
                          </th>
                          <th className="p-4 text-right text-emerald-400">Career Wins</th>
                          <th className="p-4 text-right text-emerald-400">Career Podiums</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {liveStandingsRows.map((row) => (
                          <tr
                            key={row.driverId}
                            onClick={() => {
                              if (DRIVERS_DATA.some((d) => d.id === row.driverId)) {
                                setSelectedDriverId(row.driverId);
                              }
                            }}
                            className="hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            <td className="p-4 stat-value text-lg">P{row.position}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2.5">
                                <span
                                  className="w-1.5 h-6 rounded-full shrink-0"
                                  style={{ backgroundColor: row.teamColor }}
                                />
                                <div>
                                  <span className="font-heading text-lg driver-name block">
                                    {row.fullName}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    #{row.number} • {row.nationality}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-gray-300">{row.teamName}</td>
                            <td className="p-4 text-right stat-value text-xl text-[#E10600]">
                              {formatStatValue(row.seasonPoints)}
                            </td>
                            <td className="p-4 text-right stat-value text-gray-300">
                              {formatStatValue(row.gpPoints)}
                            </td>
                            <td className="p-4 text-right stat-value text-amber-300">
                              {formatStatValue(row.sprintPoints)}
                            </td>
                            <td className="p-4 text-right stat-value">
                              {formatStatValue(row.seasonWins)}
                            </td>
                            <td className="p-4 text-right stat-value">
                              {formatStatValue(row.seasonPodiums)}
                            </td>
                            <td className="p-4 text-right stat-value">
                              {formatStatValue(row.seasonPoles)}
                            </td>
                            <td className="p-4 text-right stat-value border-l border-white/10 text-emerald-400">
                              {formatStatValue(row.careerPoints)}
                            </td>
                            <td className="p-4 text-right stat-value text-gray-200">
                              {formatStatValue(row.careerWins)}
                            </td>
                            <td className="p-4 text-right stat-value text-gray-200">
                              {formatStatValue(row.careerPodiums)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="glass-panel overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-white/5 text-xs uppercase text-gray-400 border-b border-white/10">
                        <tr>
                          <th className="p-4">Pos</th>
                          <th className="p-4">Constructor</th>
                          <th className="p-4">2026 Chassis &amp; Power Unit</th>
                          <th className="p-4 text-right">2026 Points</th>
                          <th className="p-4 text-right">2026 Wins</th>
                          <th className="p-4 text-right">2026 Podiums</th>
                          <th className="p-4 text-right border-l border-white/10 text-emerald-400">
                            All-Time Titles
                          </th>
                          <th className="p-4 text-right text-emerald-400">All-Time Wins</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {TEAMS_2026.map((t) => (
                          <tr
                            key={t.id}
                            onClick={() => setSelectedTeamId(t.id)}
                            className="hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            <td className="p-4 stat-value text-lg">P{t.season2026Position}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <span
                                  className="w-2 h-6 rounded-full"
                                  style={{ backgroundColor: t.color }}
                                />
                                <span className="font-heading text-lg team-title">{t.name}</span>
                              </div>
                            </td>
                            <td className="p-4 text-gray-400 text-xs">
                              {t.chassis2026} • {t.powerUnit}
                            </td>
                            <td className="p-4 text-right stat-value text-xl text-[#E10600]">
                              {t.season2026Points}
                            </td>
                            <td className="p-4 text-right stat-value">{t.season2026Wins}</td>
                            <td className="p-4 text-right stat-value">{t.season2026Podiums}</td>
                            <td className="p-4 text-right stat-value border-l border-white/10 text-emerald-400">
                              {t.worldChampionships}
                            </td>
                            <td className="p-4 text-right stat-value">{t.careerWins}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 2026 CALENDAR SECTION ================= */}
          {activeSection === 'calendar' && (
            <div className="space-y-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#E10600] font-bold">
                  2026 FIA FORMULA ONE WORLD CHAMPIONSHIP SCHEDULE
                </p>
                <h1 className="text-4xl sm:text-5xl font-heading mt-1">
                  2026 Grand Prix Calendar &amp; Results
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Complete round-by-round results, winners, pole-sitters, and Sprint weekend designations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CALENDAR_2026.map((race) => (
                  <div
                    key={race.round}
                    className={`glass-panel p-6 border-l-4 ${
                      race.status === 'next'
                        ? 'border-l-[#E10600] bg-[#E10600]/5'
                        : race.status === 'completed'
                        ? 'border-l-emerald-500'
                        : 'border-l-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs uppercase tracking-wider text-gray-400">
                        Round {race.round} • {race.dates}
                      </span>
                      <div className="flex items-center gap-2">
                        {race.hasSprint && (
                          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-xs">
                            Sprint Weekend
                          </span>
                        )}
                        <span
                          className={`px-2.5 py-0.5 rounded text-xs uppercase font-bold ${
                            race.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : race.status === 'next'
                              ? 'bg-[#E10600] text-white'
                              : 'bg-white/10 text-gray-300'
                          }`}
                        >
                          {race.status === 'next' ? 'Next Race' : race.status}
                        </span>
                      </div>
                    </div>

                    <h2 className="text-2xl font-heading">{race.name}</h2>
                    <p className="text-sm text-gray-400">
                      {race.circuit} • {race.location}, {race.country} ({race.laps} Laps)
                    </p>

                    {race.status === 'completed' && (
                      <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-gray-400 block">Grand Prix Winner</span>
                          <button
                            type="button"
                            onClick={() => race.winnerId && setSelectedDriverId(race.winnerId)}
                            className="font-bold text-white hover:text-[#E10600] underline decoration-white/20"
                          >
                            {race.winnerName}
                          </button>
                        </div>
                        <div>
                          <span className="text-gray-400 block">Pole Position</span>
                          <span className="font-bold text-gray-200">{race.poleDriver}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block">Fastest Lap</span>
                          <span className="font-bold text-gray-200">{race.fastestLap}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= INTERACTIVE CIRCUITS SECTION ================= */}
          {activeSection === 'circuits' && (
            <div className="space-y-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#E10600] font-bold">
                  INTERACTIVE SVG TRACK DIAGRAMS, TURN TELEMETRY &amp; VERIFIED LAP RECORDS
                </p>
                <h1 className="text-4xl sm:text-5xl font-heading mt-1">
                  Formula 1 Circuits &amp; Lap Records
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Click any circuit card to open its full-screen interactive SVG track diagram, clickable corner telemetry markers, separated Race vs Qualifying vs 2026 Fastest Lap records, and verified average lap time methodology.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                {CIRCUITS_DATA.map((c) => {
                  const ext = CIRCUIT_EXTENDED_PROFILES[c.id] || CIRCUIT_EXTENDED_PROFILES.monza;
                  return (
                    <article
                      key={c.id}
                      data-testid={`circuit-card-${c.id}`}
                      onClick={() => setSelectedCircuitId(c.id)}
                      className="glass-panel glass-panel-interactive overflow-hidden cursor-pointer flex flex-col justify-between"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 bg-[#080A0E]/90 border-b border-white/10">
                        <div className="h-44 relative overflow-hidden">
                          <VerifiedMediaImage
                            media={ext.media}
                            alt={c.name}
                            accentColor="#E10600"
                            badgeText={`${c.turns} Turns`}
                            fallbackType="circuit"
                            className="w-full h-full"
                          />
                        </div>
                        {/* Interactive SVG Track Preview */}
                        <div className="h-44 p-4 flex flex-col justify-between items-center bg-[#0D1117]/80">
                          <span className="text-[10px] uppercase tracking-widest text-gray-400 self-start">
                            SVG Track Layout
                          </span>
                          <svg viewBox="0 0 460 280" className="w-full h-28 overflow-visible">
                            <path
                              d={ext.svgPath}
                              fill="none"
                              stroke="rgba(225, 6, 0, 0.25)"
                              strokeWidth="12"
                              strokeLinecap="round"
                            />
                            <path
                              d={ext.svgPath}
                              fill="none"
                              stroke="#ffffff"
                              strokeWidth="4.5"
                              strokeLinecap="round"
                            />
                            <circle
                              cx={ext.startFinishCoord.x}
                              cy={ext.startFinishCoord.y}
                              r="6"
                              fill="#27F4D2"
                            />
                          </svg>
                          <span className="text-[11px] text-[#E10600] font-bold self-end flex items-center gap-1">
                            <span>Open Corner Telemetry</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        <div>
                          <span className="text-xs uppercase tracking-widest text-[#E10600]">
                            {c.type} • First GP: {c.firstGrandPrix}
                          </span>
                          <h2 className="text-3xl font-heading mt-1">{c.name}</h2>
                          <p className="text-sm text-gray-400">
                            {c.location}, {c.country}
                          </p>
                        </div>

                        <p className="text-sm text-gray-300 leading-relaxed">{c.technicalCharacter}</p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs">
                          <div>
                            <span className="text-gray-400 block">Length / Laps</span>
                            <span className="stat-value text-sm">
                              {prefs.units === 'metric'
                                ? `${c.lengthKm} km`
                                : `${(c.lengthKm * 0.621371).toFixed(2)} mi`}{' '}
                              ({c.laps}L)
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Official Race Record</span>
                            <span className="stat-value text-sm text-[#E10600]">
                              {ext.raceLapRecord.time}
                            </span>
                            <span className="block text-[10px] text-gray-400">
                              {ext.raceLapRecord.driver} ({ext.raceLapRecord.year})
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Qualifying Record</span>
                            <span className="stat-value text-sm text-amber-300">
                              {ext.qualifyingRecord.time}
                            </span>
                            <span className="block text-[10px] text-gray-400">
                              {ext.qualifyingRecord.driver} ({ext.qualifyingRecord.year})
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Avg Race Lap</span>
                            <span className="stat-value text-sm text-emerald-400">
                              {ext.averageLapTime.time}
                            </span>
                            <span className="block text-[10px] text-gray-400">Verified Mean</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= LIVE RACE CENTER & TELEMETRY ================= */}
          {activeSection === 'live' && (
            <div className="space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#E10600] font-bold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E10600] animate-pulse inline-block" />
                    <span>OPENF1 &amp; 2026 ACTIVE-AERO TELEMETRY DESK</span>
                  </p>
                  <h1 className="text-4xl sm:text-5xl font-heading mt-1">
                    Live Race Center &amp; Car Telemetry
                  </h1>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    aria-label="Select driver for telemetry inspection"
                    value={selectedTelemetryDriver}
                    onChange={(e) => setSelectedTelemetryDriver(e.target.value)}
                    className="bg-[#0D1117] border border-white/20 rounded-lg px-4 py-2 text-sm text-white"
                  >
                    {DRIVERS_DATA.slice(0, 10).map((d) => (
                      <option key={d.id} value={d.id}>
                        #{d.number} {d.firstName} {d.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {(() => {
                const td =
                  DRIVERS_DATA.find((d) => d.id === selectedTelemetryDriver) || DRIVERS_DATA[0];
                const ts = getDriverSeasonStats(td.id, 2026);
                const team = TEAMS_2026.find((t) => t.id === td.currentTeamId) || TEAMS_2026[0];
                return (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 glass-panel p-7 space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                        <div>
                          <h2 className="text-2xl font-heading">
                            #{td.number} {td.fullName} — {team.chassis2026} Live Telemetry
                          </h2>
                          <p className="text-xs text-gray-400">
                            Circuit of The Americas (Round 17 Classification &amp; Sector Trace)
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {(['Z-Mode (High Downforce)', 'X-Mode (Low Drag)'] as const).map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setAeroMode(m)}
                              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                                aeroMode === m
                                  ? 'bg-[#E10600] text-white'
                                  : 'bg-white/5 text-gray-400 hover:text-white'
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white/5 p-4 rounded-xl">
                          <span className="text-xs text-gray-400 block">Top Speed</span>
                          <span className="text-2xl stat-value text-white">
                            {aeroMode.startsWith('X-Mode')
                              ? prefs.units === 'metric'
                                ? '346 km/h'
                                : '215 mph'
                              : prefs.units === 'metric'
                              ? '312 km/h'
                              : '194 mph'}
                          </span>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl">
                          <span className="text-xs text-gray-400 block">MGU-K Deployment</span>
                          <span className="text-2xl stat-value text-emerald-400">350 kW</span>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl">
                          <span className="text-xs text-gray-400 block">Battery SoC</span>
                          <span className="text-2xl stat-value text-amber-300">88%</span>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl">
                          <span className="text-xs text-gray-400 block">2026 Season Wins</span>
                          <span className="text-2xl stat-value text-[#E10600]">{ts.gpWins}</span>
                        </div>
                      </div>

                      <div className="bg-white/[0.02] p-5 rounded-xl border border-white/10 space-y-3">
                        <h3 className="text-base font-heading">
                          Recent 2026 Grand Prix Classification Log
                        </h3>
                        {td.recentRaces2026.length > 0 ? (
                          <table className="w-full text-left text-xs">
                            <thead className="text-gray-400 uppercase border-b border-white/10">
                              <tr>
                                <th className="py-2">Round</th>
                                <th className="py-2">Grand Prix</th>
                                <th className="py-2">Grid</th>
                                <th className="py-2">Finish</th>
                                <th className="py-2 text-right">GP Points</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {td.recentRaces2026.map((r) => (
                                <tr key={r.round}>
                                  <td className="py-2.5 stat-value">R{r.round}</td>
                                  <td className="py-2.5 font-bold">{r.gpName}</td>
                                  <td className="py-2.5 stat-value">P{r.grid}</td>
                                  <td className="py-2.5 stat-value text-emerald-400">P{r.finish}</td>
                                  <td className="py-2.5 text-right stat-value text-[#E10600]">
                                    +{r.gpPoints}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p className="text-xs text-gray-400">
                            Full season points ({ts.points} pts across {ts.gpEntries} entries) verified in the Championship Standings ledger.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="glass-panel p-7 space-y-5">
                      <h2 className="text-2xl font-heading">Pit Wall Strategy Feed</h2>
                      <div className="space-y-4 text-sm">
                        <div className="p-3.5 rounded-lg bg-white/5 border-l-2 border-l-emerald-400">
                          <span className="text-xs text-gray-400 block">Lap 56/56 • Checkered Flag</span>
                          <p className="mt-1">
                            Kimi Antonelli wins the 2026 United States Grand Prix from Pole Position, extending his Championship lead to 325 points (8 GP victories).
                          </p>
                        </div>
                        <div className="p-3.5 rounded-lg bg-white/5 border-l-2 border-l-[#E10600]">
                          <span className="text-xs text-gray-400 block">Lap 42/56 • Manual Override</span>
                          <p className="mt-1">
                            Lewis Hamilton deploys 350kW Override boost into Turn 12 to secure P2 and his 213th career Grand Prix podium.
                          </p>
                        </div>
                        <div className="p-3.5 rounded-lg bg-white/5 border-l-2 border-l-blue-400">
                          <span className="text-xs text-gray-400 block">Sprint Classification Note</span>
                          <p className="mt-1">
                            Saturday Sprint points (8-7-6-5-4-3-2-1) are added to the World Championship standings while keeping Grand Prix feature race win &amp; podium counts strictly separate.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ================= TIME MACHINE & HISTORICAL SCORING ================= */}
          {activeSection === 'timemachine' && (
            <div className="space-y-10">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#E10600] font-bold">
                  HISTORICAL ARCHIVE (1950–2026) &amp; FIA SCORING ENGINE
                </p>
                <h1 className="text-4xl sm:text-5xl font-heading mt-1">
                  Formula 1 Time Machine
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Query historical championship seasons via the Jolpica-F1 API and compare historical FIA points systems across eras.
                </p>
              </div>

              {/* Interactive Historical Points Calculator */}
              <div className="glass-panel p-7 space-y-6 border-l-4 border-l-[#E10600]">
                <h2 className="text-2xl font-heading">
                  Historical FIA Points System Calculator (1950–2026)
                </h2>
                <p className="text-sm text-gray-300">
                  Test how any finishing position is scored across different Formula 1 regulatory eras, including Sprint races and Fastest Lap bonus rules.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                  <div>
                    <label htmlFor="calc-era-year" className="block text-xs text-gray-400 mb-1">
                      Select Championship Era
                    </label>
                    <select
                      id="calc-era-year"
                      value={calcEraYear}
                      onChange={(e) => setCalcEraYear(Number(e.target.value))}
                      className="w-full bg-[#0D1117] border border-white/20 rounded-lg px-3 py-2 text-sm text-white"
                    >
                      <option value={2026}>2025–2026 Modern Era (25 pts, No FL Bonus)</option>
                      <option value={2022}>2019–2024 Modern Era (25 pts + 1 FL Bonus)</option>
                      <option value={2005}>2003–2009 Top-8 Era (10-8-6-5-4-3-2-1)</option>
                      <option value={1998}>1991–2002 Top-6 Era (10-6-4-3-2-1)</option>
                      <option value={1985}>1961–1990 Classic Era (9-6-4-3-2-1)</option>
                      <option value={1955}>1950–1959 Inaugural Era (8-6-4-3-2 + 1 FL)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="calc-pos" className="block text-xs text-gray-400 mb-1">
                      Finishing Position
                    </label>
                    <select
                      id="calc-pos"
                      value={calcPosition}
                      onChange={(e) => setCalcPosition(Number(e.target.value))}
                      className="w-full bg-[#0D1117] border border-white/20 rounded-lg px-3 py-2 text-sm text-white"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((pos) => (
                        <option key={pos} value={pos}>
                          P{pos} Finish
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={calcIsSprint}
                        onChange={(e) => setCalcIsSprint(e.target.checked)}
                      />
                      <span>Sprint Race Session</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={calcFastestLap}
                        onChange={(e) => setCalcFastestLap(e.target.checked)}
                      />
                      <span>Fastest Lap Achieved</span>
                    </label>
                  </div>

                  <div className="bg-white/5 p-4 rounded-xl text-center border border-white/10">
                    <span className="text-xs text-gray-400 uppercase block">Awarded Points</span>
                    <span className="text-3xl stat-value text-[#E10600]">
                      {calculateHistoricalPoints(calcEraYear, calcPosition, {
                        isSprint: calcIsSprint,
                        fastestLap: calcFastestLap,
                      })}{' '}
                      pts
                    </span>
                  </div>
                </div>
              </div>

              {/* Historical Season Explorer */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="text-2xl font-heading">
                    Historical Season Standings Explorer ({archiveYear})
                  </h2>
                  <div className="flex items-center gap-2">
                    <label htmlFor="archive-year-select" className="text-xs text-gray-400">
                      Select Season:
                    </label>
                    <select
                      id="archive-year-select"
                      value={archiveYear}
                      onChange={(e) => setArchiveYear(Number(e.target.value))}
                      className="bg-[#0D1117] border border-white/20 rounded-lg px-3.5 py-2 text-sm text-white"
                    >
                      {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2015, 2014, 2012, 2008, 2007, 2004, 1998, 1991, 1988, 1976, 1950].map(
                        (yr) => (
                          <option key={yr} value={yr}>
                            {yr} Season
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                {archiveLoading ? (
                  <div className="glass-panel p-12 text-center">
                    <RefreshCw className="w-6 h-6 text-[#E10600] animate-spin mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Loading {archiveYear} season archive...</p>
                  </div>
                ) : (
                  <div className="glass-panel overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-white/5 text-xs uppercase text-gray-400">
                        <tr>
                          <th className="p-4">Pos</th>
                          <th className="p-4">Driver</th>
                          <th className="p-4">Constructor</th>
                          <th className="p-4 text-right">{archiveYear} Season Points</th>
                          <th className="p-4 text-right">{archiveYear} Wins</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {archiveRows.slice(0, 15).map((r) => (
                          <tr key={`${r.driverId}-${r.position}`} className="hover:bg-white/5">
                            <td className="p-4 stat-value">P{r.position}</td>
                            <td className="p-4 font-heading text-lg">{r.fullName}</td>
                            <td className="p-4 text-gray-400">{r.teamName}</td>
                            <td className="p-4 text-right stat-value text-[#E10600]">
                              {formatStatValue(r.seasonPoints)}
                            </td>
                            <td className="p-4 text-right stat-value">
                              {formatStatValue(r.seasonWins)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= HALL OF FAME SECTION (WITH LEWIS HAMILTON SPOTLIGHT) ================= */}
          {activeSection === 'halloffame' && (
            <div className="space-y-10">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#E10600] font-bold">
                  IMMORTALS OF THE APEX • ALL-TIME WORLD CHAMPIONS
                </p>
                <h1 className="text-4xl sm:text-5xl font-heading mt-1">
                  Formula 1 Hall of Fame
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Verified career records of Formula 1’s greatest World Champions across seven decades, led by our featured Hall of Fame Induction Spotlight on Seven-Time World Champion Sir Lewis Hamilton.
                </p>
              </div>

              {/* Featured Hall of Fame Spotlight: Sir Lewis Hamilton */}
              <section
                data-testid="halloffame-hamilton-spotlight"
                className="glass-panel overflow-hidden border-2 border-amber-400/50"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3">
                  <div className="min-h-[360px] relative">
                    <VerifiedMediaImage
                      media={LEWIS_HAMILTON_HALL_OF_FAME.media}
                      alt={LEWIS_HAMILTON_HALL_OF_FAME.fullName}
                      accentColor="#E10600"
                      badgeText="7x World Champion • #44"
                      fallbackType="driver"
                      objectPosition="center 14%"
                      className="w-full h-full"
                    />
                  </div>

                  <div className="lg:col-span-2 p-6 sm:p-8 space-y-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <span className="px-3 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
                          Featured Hall of Fame Legend • Active 2026 Icon
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-heading driver-name mt-2">
                          {LEWIS_HAMILTON_HALL_OF_FAME.fullName}
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">
                          Championship Years: {LEWIS_HAMILTON_HALL_OF_FAME.titleYears.join(' • ')}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedDriverId('hamilton')}
                        className="px-4 py-2 rounded-lg bg-[#E10600] hover:bg-red-700 text-white text-xs font-bold transition-colors"
                      >
                        Open Full 2026 &amp; Career Dossier
                      </button>
                    </div>

                    {/* All-Time Record Counters */}
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center">
                      <div className="bg-white/5 p-3 rounded-xl border border-amber-400/30">
                        <span className="text-[11px] text-gray-400 block">World Titles</span>
                        <span className="text-2xl stat-value text-amber-300">
                          {LEWIS_HAMILTON_HALL_OF_FAME.titles}
                        </span>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl">
                        <span className="text-[11px] text-gray-400 block">Career Wins</span>
                        <span className="text-2xl stat-value text-[#E10600]">
                          {LEWIS_HAMILTON_HALL_OF_FAME.careerWins}
                        </span>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl">
                        <span className="text-[11px] text-gray-400 block">Career Poles</span>
                        <span className="text-2xl stat-value text-white">
                          {LEWIS_HAMILTON_HALL_OF_FAME.careerPoles}
                        </span>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl">
                        <span className="text-[11px] text-gray-400 block">Career Podiums</span>
                        <span className="text-2xl stat-value text-emerald-400">
                          {LEWIS_HAMILTON_HALL_OF_FAME.careerPodiums}
                        </span>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl">
                        <span className="text-[11px] text-gray-400 block">Career Points</span>
                        <span className="text-xl stat-value text-white">
                          {LEWIS_HAMILTON_HALL_OF_FAME.careerPoints}
                        </span>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl">
                        <span className="text-[11px] text-gray-400 block">GP Entries</span>
                        <span className="text-xl stat-value text-white">
                          {LEWIS_HAMILTON_HALL_OF_FAME.careerEntries}
                        </span>
                      </div>
                    </div>

                    {/* Three Constructor Era Chapters (McLaren, Mercedes, Ferrari) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {LEWIS_HAMILTON_HALL_OF_FAME.chapters.map((ch) => (
                        <div
                          key={ch.era}
                          className="bg-white/[0.03] p-4 rounded-xl border-t-2 flex flex-col justify-between"
                          style={{ borderTopColor: ch.color }}
                        >
                          <div>
                            <span className="text-xs font-bold uppercase" style={{ color: ch.color }}>
                              {ch.era} • {ch.team}
                            </span>
                            <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                              {ch.summary}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setArchiveYear(ch.keySeasonLink);
                              navigateTo('timemachine');
                            }}
                            className="mt-3 text-[11px] text-amber-300 hover:underline flex items-center gap-1"
                          >
                            <span>Inspect {ch.keySeasonLink} Season in Time Machine</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                {HISTORICAL_LEGENDS.map((leg) => (
                  <article key={leg.id} className="glass-panel p-7 space-y-5 border-t-4 border-t-amber-400">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs uppercase tracking-widest text-amber-300">
                          {leg.era} • {leg.nationality}
                        </span>
                        <h2 className="text-3xl font-heading mt-1 driver-name">{leg.name}</h2>
                        <p className="text-xs text-gray-400 mt-0.5">{leg.iconicTeam}</p>
                      </div>
                      <span className="px-3 py-1 rounded bg-amber-500/20 text-amber-300 stat-value text-sm">
                        {leg.worldChampionships}x World Champion
                      </span>
                    </div>

                    <p className="text-sm text-gray-300 leading-relaxed">{leg.bio}</p>

                    <div className="grid grid-cols-5 gap-2 pt-4 border-t border-white/10 text-center text-xs">
                      <div className="bg-white/5 p-2.5 rounded">
                        <span className="text-gray-400 block">Entries</span>
                        <span className="stat-value text-base">{leg.careerEntries}</span>
                      </div>
                      <div className="bg-white/5 p-2.5 rounded">
                        <span className="text-gray-400 block">Wins</span>
                        <span className="stat-value text-base text-[#E10600]">{leg.careerWins}</span>
                      </div>
                      <div className="bg-white/5 p-2.5 rounded">
                        <span className="text-gray-400 block">Podiums</span>
                        <span className="stat-value text-base">{leg.careerPodiums}</span>
                      </div>
                      <div className="bg-white/5 p-2.5 rounded">
                        <span className="text-gray-400 block">Poles</span>
                        <span className="stat-value text-base">{leg.careerPoles}</span>
                      </div>
                      <div className="bg-white/5 p-2.5 rounded">
                        <span className="text-gray-400 block">Points</span>
                        <span className="stat-value text-base">{leg.careerPoints}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* ================= F1 ACADEMY & 20-TOPIC LEARNING HUB SECTION ================= */}
          {activeSection === 'learn' && (
            <div className="space-y-12">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#E10600] font-bold">
                  F1 ACADEMY OFFICIAL SERIES SHOWCASE &amp; 20-TOPIC F1 ENCYCLOPEDIA
                </p>
                <h1 className="text-4xl sm:text-5xl font-heading mt-1">
                  F1 Academy &amp; Complete Learning Hub
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Explore the official F1 Academy all-female championship propelling female talent toward Formula 3, Formula 2, and Formula 1, followed by our 20-module Sporting, Strategy, and Engineering Encyclopedia.
                </p>
              </div>

              {/* Part 1: F1 Academy Official Series Showcase */}
              <section className="glass-panel p-7 sm:p-9 space-y-8 border-l-4 border-l-[#27F4D2]">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="max-w-3xl space-y-3">
                    <span className="px-3 py-1 rounded bg-[#27F4D2]/15 text-[#27F4D2] text-xs font-bold uppercase">
                      Official Formula 1 Feeder Series • Founded 2023 • Led by Susie Wolff
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-heading">
                      F1 Academy: Empowering Female Talent on the Road to F1
                    </h2>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      F1 Academy is Formula 1’s official all-female single-seater championship designed to develop and prepare young female drivers to progress to higher levels of competition (FRECA, FIA Formula 3, FIA Formula 2, and Formula 1). Every F1 constructor nominates and liveries a supported driver across a 7-round global calendar running alongside official Formula 1 Grand Prix weekends.
                    </p>
                  </div>

                  {/* Tatuus F4-T421 Car Specifications Box */}
                  <div className="glass-panel p-5 bg-white/[0.03] min-w-[290px] space-y-2 text-xs">
                    <p className="text-[#27F4D2] uppercase font-bold tracking-wider">
                      F1 Academy Spec Car
                    </p>
                    <h3 className="text-lg font-heading">Tatuus F4-T421 Chassis</h3>
                    <div className="space-y-1.5 pt-2 border-t border-white/10">
                      <div className="flex justify-between gap-3">
                        <span className="text-gray-400 shrink-0">Engine:</span>
                        <span className="stat-value text-right">Autotecnica 1.4L Turbo (174 bhp)</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-gray-400 shrink-0">Top Speed:</span>
                        <span className="stat-value text-right">240 km/h (149 mph)</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-gray-400 shrink-0">Tyres / Aero:</span>
                        <span className="stat-value text-right">13&quot; Pirelli / F1-Inspired Wings</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-gray-400 shrink-0">Super Licence:</span>
                        <span className="stat-value text-emerald-400 text-right">10 FIA Pts to Champion</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured F1 Academy Tatuus F4-T421 Single-Seater Car Showcase Banner */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center f1-glass-overlay rounded-2xl p-4 sm:p-5 border border-white/15">
                  <div className="lg:col-span-5">
                    <VerifiedMediaImage
                      media={{
                        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Abbi_Pulling_Tatuus_Singapore_2024.jpg',
                        author: 'Elenav2009 / Wikimedia Commons',
                        license: 'CC BY-SA 4.0',
                        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Abbi_Pulling_Tatuus_Singapore_2024.jpg',
                        caption: 'F1 Academy Tatuus F4-T421 single-seater race car at the Marina Bay Street Circuit during the Formula 1 Singapore Grand Prix weekend',
                      }}
                      alt="F1 Academy Tatuus F4-T421 Single-Seater Race Car"
                      accentColor="#27F4D2"
                      badgeText="Tatuus F4-T421 • Official Series Spec"
                      fallbackType="car"
                      objectPosition="center center"
                      containerClassName="h-52 sm:h-60 w-full rounded-xl"
                    />
                  </div>
                  <div className="lg:col-span-7 space-y-3">
                    <span className="text-[11px] font-mono-tech uppercase tracking-widest text-[#27F4D2] block">
                      Official F1 Academy Single-Seater Machinery
                    </span>
                    <h3 className="text-2xl font-heading text-white">
                      Tatuus F4-T421 FIA Formula 4 Spec Challenger
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                      Every F1 Academy competitor races an identical carbon-fibre monocoque Tatuus F4-T421 equipped with a FIA-homologated steel Halo, 1.4-litre 4-cylinder Autotecnica Motori turbocharged engine delivering 174 bhp at 5,500 rpm, Sadev 6-speed sequential paddle-shift transmission, and official F1 constructor liveries.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                      <div className="f1-glass-panel p-3 rounded-xl">
                        <span className="text-[10px] font-mono-tech text-gray-400 uppercase block">Top Speed</span>
                        <span className="text-sm font-mono-tech font-bold text-white">240 km/h (149 mph)</span>
                      </div>
                      <div className="f1-glass-panel p-3 rounded-xl">
                        <span className="text-[10px] font-mono-tech text-gray-400 uppercase block">0–100 km/h</span>
                        <span className="text-sm font-mono-tech font-bold text-[#E10600]">3.6 Seconds</span>
                      </div>
                      <div className="f1-glass-panel p-3 rounded-xl">
                        <span className="text-[10px] font-mono-tech text-gray-400 uppercase block">Dry Weight</span>
                        <span className="text-sm font-mono-tech font-bold text-emerald-300">570 kg (inc. driver)</span>
                      </div>
                      <div className="f1-glass-panel p-3 rounded-xl">
                        <span className="text-[10px] font-mono-tech text-gray-400 uppercase block">Operating Teams</span>
                        <span className="text-xs font-mono-tech font-bold text-white">PREMA • Rodin • Campos • MP • ART</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* F1 Academy Featured Contenders Grid — 6 Face-Visible Portraits with Click-to-Reveal Glass Profile */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <h3 className="text-2xl font-heading">
                      F1 Academy Standout Drivers &amp; Constructor Backing
                    </h3>
                    <span className="text-xs text-[#27F4D2] font-semibold">
                      Click Any Driver Card to Open Full-Screen Glass Profile →
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {F1_ACADEMY_SERIES_DRIVERS.map((ad) => (
                      <div
                        key={ad.id}
                        role="button"
                        tabIndex={0}
                        data-testid={`academy-driver-card-${ad.id}`}
                        onClick={() => setSelectedAcademyDriver(ad)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedAcademyDriver(ad);
                          }
                        }}
                        className="group relative h-[440px] rounded-2xl glass-panel glass-panel-interactive overflow-hidden cursor-pointer flex flex-col justify-between border-t-4"
                        style={{ borderTopColor: ad.teamColor }}
                      >
                        {/* Full-Bleed Unobscured Driver Portrait */}
                        <div className="absolute inset-0 z-0 bg-[#07090D]">
                          <VerifiedMediaImage
                            media={ad.media}
                            alt={ad.name}
                            accentColor={ad.teamColor}
                            badgeText={`#${ad.number} • ${ad.f1SupportedBy}`}
                            fallbackType="driver"
                            objectPosition={ad.objectPosition || 'center 18%'}
                            className="w-full h-full"
                            imgClassName="object-cover transition-transform duration-700 group-hover:scale-105"
                            showAttributionBar={false}
                            gradientOverlayClassName="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#05070B] via-[#07090F]/75 to-transparent pointer-events-none"
                          />
                        </div>

                        {/* Top Corner Pills */}
                        <div className="relative z-10 p-4 flex items-start justify-between pointer-events-none">
                          <span
                            className="px-2.5 py-1 rounded-md text-xs font-bold text-black shadow-lg"
                            style={{ backgroundColor: ad.teamColor }}
                          >
                            #{ad.number} • {ad.f1SupportedBy.split('(')[0].trim()}
                          </span>
                          <span className="px-2.5 py-1 rounded-md f1-glass-pill text-xs text-white font-medium">
                            {ad.nationality}
                          </span>
                        </div>

                        {/* Clean Bottom Identity Strip */}
                        <div className="relative z-10 p-5 pt-0 mt-auto">
                          <div className="flex items-end justify-between gap-2">
                            <div className="min-w-0">
                              <span
                                className="text-[11px] uppercase font-bold tracking-wider block truncate"
                                style={{ color: ad.teamColor }}
                              >
                                {ad.team}
                              </span>
                              <h4 className="text-2xl sm:text-3xl font-heading driver-name text-white mt-0.5 truncate">
                                {ad.name}
                              </h4>
                              <p className="text-xs text-emerald-300 font-semibold mt-0.5 line-clamp-1">
                                {ad.f1SupportedBy}
                              </p>
                            </div>
                            <span
                              className="text-3xl sm:text-4xl font-heading font-black italic shrink-0"
                              style={{ color: ad.teamColor }}
                            >
                              #{ad.number}
                            </span>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-xs text-gray-200">
                            <span>
                              Pts: <strong className="text-[#E10600] stat-value">{ad.seasonPoints}</strong> • Wins:{' '}
                              <strong className="text-white stat-value">{ad.wins}</strong> • Podiums:{' '}
                              <strong className="text-white stat-value">{ad.podiums}</strong>
                            </span>
                            <span className="inline-flex items-center gap-1 font-bold text-white group-hover:text-[#E10600] transition-colors">
                              <span>Open Profile</span>
                              <ChevronRight className="w-4 h-4 text-[#E10600]" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* F1 Academy 2026 Support Calendar */}
                <div>
                  <h3 className="text-xl font-heading mb-3">
                    2026 F1 Academy Global Calendar (7 Grand Prix Support Rounds)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    {F1_ACADEMY_CALENDAR_2026.map((r) => (
                      <div key={r.round} className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                        <span className="text-[#27F4D2] font-bold uppercase">
                          Round {r.round} • {r.dates}
                        </span>
                        <p className="font-bold text-white mt-1">{r.event}</p>
                        <p className="text-gray-400">{r.supportFor}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Part 2: 20-Topic Complete F1 Learning Hub */}
              <section className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#E10600] font-bold">
                      20 STRUCTURED EDUCATIONAL MODULES
                    </span>
                    <h2 className="text-3xl font-heading mt-1">
                      Complete Formula 1 Sporting &amp; Technical Learning Hub
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      'all',
                      'Sporting & Rules',
                      'Strategy & Tyres',
                      'Engineering & Aero',
                      'Championship & Heritage',
                    ].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setLearningCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          learningCategoryFilter === cat
                            ? 'bg-[#E10600] text-white'
                            : 'bg-white/5 text-gray-300 hover:bg-white/15'
                        }`}
                      >
                        {cat === 'all' ? 'All 20 Topics' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative max-w-md">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={learningSearch}
                    onChange={(e) => setLearningSearch(e.target.value)}
                    placeholder="Search 20 F1 topics (e.g., Undercut, VSC, Qualifying, MGU-K)..."
                    aria-label="Search F1 Learning Hub topics"
                    className="w-full bg-[#0D1117] border border-white/15 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:border-[#E10600] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredLearningTopics.map((topic) => {
                    const isExpanded = expandedTopicId === topic.id;
                    return (
                      <div
                        key={topic.id}
                        data-testid={`learning-topic-${topic.number}`}
                        className="glass-panel p-6 flex flex-col justify-between border-t-2 border-t-white/20 hover:border-t-[#E10600]"
                      >
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-[#E10600] uppercase">
                              Topic {String(topic.number).padStart(2, '0')} • {topic.category}
                            </span>
                          </div>
                          <h3 className="text-2xl font-heading mb-2">{topic.title}</h3>
                          <p className="text-sm text-gray-300 leading-relaxed mb-4">
                            {topic.summary}
                          </p>

                          <ul className="space-y-1.5 text-xs text-gray-300 list-disc pl-4 mb-4">
                            {topic.keyFacts.map((fact) => (
                              <li key={fact}>{fact}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <button
                            type="button"
                            onClick={() => setExpandedTopicId(isExpanded ? '' : topic.id)}
                            className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
                          >
                            <span>
                              {isExpanded ? 'Hide Engineering Insight' : 'View Engineering Insight'}
                            </span>
                            <ChevronRight
                              className={`w-3.5 h-3.5 transition-transform ${
                                isExpanded ? 'rotate-90' : ''
                              }`}
                            />
                          </button>
                          {isExpanded && (
                            <p className="mt-3 p-3.5 rounded-lg bg-white/5 text-xs text-gray-200 leading-relaxed border-l-2 border-l-emerald-400">
                              {topic.technicalDeepDive}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Part 3: Preserved Executive Core Modules */}
              <div className="space-y-6 pt-6 border-t border-white/10">
                <h2 className="text-2xl font-heading">Executive Masterclass Briefings</h2>
                {ACADEMY_MODULES.map((mod) => {
                  const isExpanded = expandedModuleId === mod.id;
                  return (
                    <div key={mod.id} className="glass-panel p-7">
                      <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                        <span className="bg-[#E10600]/20 text-[#E10600] px-3 py-1 rounded text-xs font-bold uppercase">
                          {mod.moduleNumber}
                        </span>
                        <span className="text-xs text-gray-400">{mod.readTime}</span>
                      </div>
                      <h3 className="text-2xl font-heading mb-1">{mod.title}</h3>
                      <p className="text-sm text-gray-400 mb-4">{mod.subtitle}</p>
                      <p className="text-gray-200 leading-relaxed mb-5">{mod.summary}</p>

                      <button
                        type="button"
                        onClick={() => setExpandedModuleId(isExpanded ? '' : mod.id)}
                        className="text-sm font-bold text-[#E10600] hover:underline flex items-center gap-1.5"
                      >
                        <span>{isExpanded ? 'Hide Technical Deep Dive' : 'Read Technical Deep Dive'}</span>
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="mt-5 pt-5 border-t border-white/10 space-y-4">
                          <ul className="space-y-2 text-sm text-gray-300 list-disc pl-5">
                            {mod.keyTakeaways.map((kt) => (
                              <li key={kt}>{kt}</li>
                            ))}
                          </ul>
                          <p className="text-sm text-gray-300 bg-white/5 p-4 rounded-xl leading-relaxed">
                            {mod.deepDive}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= INTERACTIVE F1 TECHNOLOGY & CAR ANATOMY SECTION ================= */}
          {activeSection === 'technology' && (
            <div className="space-y-10">
              <AnimatedF1CarExplorer
                selectedComponentId={selectedComponentId}
                onSelectComponent={setSelectedComponentId}
              />

              {/* Preserved 2026 Core Regulation Pillars */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 pt-6 border-t border-white/10">
                {TECH_SYSTEMS.map((sys) => (
                  <div key={sys.id} className="glass-panel p-7 flex flex-col justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-[#E10600]">
                        {sys.category}
                      </span>
                      <h2 className="text-2xl font-heading mt-1 mb-2">{sys.name}</h2>
                      <p className="text-xs text-emerald-300 font-bold mb-4">{sys.specHighlight}</p>
                      <p className="text-sm text-gray-300 leading-relaxed mb-6">{sys.description}</p>
                    </div>

                    <div className="space-y-2.5 pt-4 border-t border-white/10">
                      {sys.metrics.map((m) => (
                        <div key={m.label} className="flex justify-between text-xs">
                          <span className="text-gray-400">{m.label}</span>
                          <span className="stat-value text-white">{m.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= FAVORITES & CLOUD SYNC SECTION ================= */}
          {activeSection === 'favorites' && (
            <div className="space-y-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#E10600] font-bold">
                    YOUR CURATED PADDOCK • LOCAL GUEST &amp; FIREBASE CLOUD PERSISTENCE
                  </p>
                  <h1 className="text-4xl sm:text-5xl font-heading mt-1">
                    Saved Drivers &amp; Constructors
                  </h1>
                </div>
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(true)}
                  className="px-4 py-2.5 rounded-lg bg-[#E10600] hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  <Cloud className="w-4 h-4" />
                  <span>
                    {currentUser ? 'Manage Cloud Sync Account' : 'Sign In to Sync Across Devices'}
                  </span>
                </button>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-heading">Favorite Drivers</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {DRIVERS_DATA.filter((d) => prefs.favorites.drivers.includes(d.id)).map((d) => {
                    const s = getDriverSeasonStats(d.id, selectedSeason);
                    const c = getDriverCareerStats(d.id);
                    const ext = getDriverExtendedMetadata(d.id, d.fullName, d.currentTeamId);
                    const team = TEAMS_2026.find((t) => t.id === d.currentTeamId) || TEAMS_2026[0];
                    return (
                      <div
                        key={d.id}
                        onClick={() => setSelectedDriverId(d.id)}
                        className="glass-panel glass-panel-interactive overflow-hidden cursor-pointer"
                      >
                        <div className="h-40 relative">
                          <VerifiedMediaImage
                            media={ext.media}
                            alt={d.fullName}
                            accentColor={team.color}
                            badgeText={`#${d.number}`}
                            fallbackType="driver"
                            className="w-full h-full"
                          />
                        </div>
                        <div className="p-5">
                          <h3 className="text-2xl font-heading driver-name">{d.fullName}</h3>
                          <p className="text-xs text-gray-400 mb-4">
                            {selectedSeason} Pos: P{s.position} • {s.points} Season Pts • {c.points} Career Pts
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavoriteDriver(d.id);
                            }}
                            className="text-xs text-[#E10600] hover:underline"
                          >
                            Remove from Favorites
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-white/10">
                <h2 className="text-2xl font-heading">Favorite Constructors</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {TEAMS_2026.filter((t) => prefs.favorites.teams.includes(t.id)).map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTeamId(t.id)}
                      className="glass-panel glass-panel-interactive p-6 cursor-pointer border-l-4"
                      style={{ borderLeftColor: t.color }}
                    >
                      <h3 className="text-2xl font-heading team-title">{t.name}</h3>
                      <p className="text-xs text-gray-400 mb-4">
                        2026 P{t.season2026Position} ({t.season2026Points} pts) • {t.worldChampionships} World Titles
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavoriteTeam(t.id);
                        }}
                        className="text-xs text-[#E10600] hover:underline"
                      >
                        Remove from Favorites
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= SETTINGS SECTION ================= */}
          {activeSection === 'settings' && (
            <div className="space-y-8 max-w-2xl">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#E10600] font-bold">
                  PREFERENCES, AUTHENTICATION &amp; TELEMETRY CONFIGURATION
                </p>
                <h1 className="text-4xl sm:text-5xl font-heading mt-1">Hub Settings</h1>
              </div>

              <div className="glass-panel p-7 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-xl font-heading">Measurement Units</h2>
                    <p className="text-xs text-gray-400">
                      Select kilometres (Metric) or miles (Imperial) for circuit and speed readouts.
                    </p>
                  </div>
                  <select
                    aria-label="Measurement units"
                    value={prefs.units}
                    onChange={(e) => {
                      const nextUnits = e.target.value as 'metric' | 'imperial';
                      setPrefs((prev) => {
                        const next = { ...prev, units: nextUnits };
                        void syncPrefsToCloudIfAuthenticated(next);
                        return next;
                      });
                    }}
                    className="bg-[#0D1117] border border-white/20 rounded-lg px-4 py-2 text-sm text-white"
                  >
                    <option value="metric">Metric (km, km/h)</option>
                    <option value="imperial">Imperial (miles, mph)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-xl font-heading">Cross-Device Cloud Account &amp; Guest Mode</h2>
                    <p className="text-xs text-gray-400">
                      {currentUser
                        ? `Authenticated as ${currentUser.email} (${cloudSyncStatus})`
                        : 'Currently browsing in Guest Mode with local browser storage.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAuthModalOpen(true)}
                    className="px-4 py-2 rounded-lg bg-[#E10600] hover:bg-red-700 text-white text-xs font-bold"
                  >
                    {currentUser ? 'Account Settings' : 'Sign In / Register'}
                  </button>
                </div>

                <div>
                  <h2 className="text-xl font-heading mb-1">Typography &amp; Editorial Standard</h2>
                  <p className="text-sm text-gray-300">
                    Active Global Theme: <strong>Times New Roman</strong> headings paired with{' '}
                    <strong>Georgia</strong> body copy (+6.5% enhanced readability scale and 0.045em word spacing).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Driver Full-Screen Profile Modal */}
      {selectedDriverModalObj && (
        <DriverModal
          driver={selectedDriverModalObj}
          selectedSeason={selectedSeason}
          isFavorite={prefs.favorites.drivers.includes(selectedDriverModalObj.id)}
          onToggleFavorite={toggleFavoriteDriver}
          onSelectDriver={(id) => setSelectedDriverId(id)}
          onSelectTeam={(teamId) => {
            setSelectedDriverId(null);
            setSelectedTeamId(teamId);
          }}
          onClose={() => setSelectedDriverId(null)}
        />
      )}

      {/* Constructor Full-Screen Profile Modal */}
      {selectedTeamModalObj && (
        <TeamModal
          team={selectedTeamModalObj}
          isFavorite={prefs.favorites.teams.includes(selectedTeamModalObj.id)}
          onToggleFavorite={toggleFavoriteTeam}
          onSelectDriver={(driverId) => {
            setSelectedTeamId(null);
            setSelectedDriverId(driverId);
          }}
          onClose={() => setSelectedTeamId(null)}
        />
      )}

      {/* Circuit Full-Screen Interactive Modal */}
      {selectedCircuitModalObj && (
        <CircuitModal
          circuit={selectedCircuitModalObj}
          units={prefs.units}
          onClose={() => setSelectedCircuitId(null)}
        />
      )}

      {/* F1 Academy Driver Full-Screen Glassmorphism Modal */}
      {selectedAcademyDriver && (
        <F1AcademyDriverModal
          driver={selectedAcademyDriver}
          onSelectDriver={(nextDriver) => setSelectedAcademyDriver(nextDriver)}
          onClose={() => setSelectedAcademyDriver(null)}
        />
      )}

      {/* Firebase Authentication & Guest Migration Modal */}
      {authModalOpen && (
        <AuthModal
          currentUser={currentUser}
          cloudSyncStatus={cloudSyncStatus}
          cloudSyncMessage={cloudSyncMessage}
          guestDriversCount={prefs.favorites.drivers.length}
          guestTeamsCount={prefs.favorites.teams.length}
          onAuthSuccessMigrateGuest={async (user, mergeGuest) => {
            await syncPrefsToCloudIfAuthenticated(prefs, user, mergeGuest);
          }}
          onManualSyncNow={async () => {
            await syncPrefsToCloudIfAuthenticated(prefs, currentUser, true);
          }}
          onClose={() => setAuthModalOpen(false)}
        />
      )}

      {/* Optional Floating Gemini F1 Race Engineer Assistant */}
      <GeminiAssistant />
    </div>
  );
}
