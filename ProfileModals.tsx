import React, { useState } from 'react';
import {
  X,
  Heart,
  Trophy,
  Flag,
  Zap,
  CheckCircle2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Award,
  Building2,
  Clock,
  Play,
  Video,
  Mic,
  Sparkles,
  Calendar,
  MapPin,
} from 'lucide-react';
import {
  DriverProfile,
  TeamProfile,
  TEAMS_2026,
  DRIVERS_DATA,
  getDriverSeasonStats,
  getDriverCareerStats,
  formatStatValue,
} from '../utils/f1StatsEngine';
import {
  getDriverExtendedMetadata,
  getDriverInterviews,
  DriverInterviewItem,
  TEAM_GOVERNANCE_AND_MEDIA,
  CIRCUIT_EXTENDED_PROFILES,
  F1AcademySeriesProfile,
  F1_ACADEMY_SERIES_DRIVERS,
} from '../data/f1MediaAndProfiles';
import { CircuitProfile } from '../data/f1UniverseData';
import { VerifiedMediaImage, resolveWikimediaCdnUrl } from './VerifiedMediaImage';

interface DriverModalProps {
  driver: DriverProfile;
  selectedSeason: number;
  isFavorite: boolean;
  onToggleFavorite: (driverId: string) => void;
  onSelectDriver: (driverId: string) => void;
  onSelectTeam: (teamId: string) => void;
  onClose: () => void;
}

export const DriverModal: React.FC<DriverModalProps> = ({
  driver,
  selectedSeason,
  isFavorite,
  onToggleFavorite,
  onSelectDriver,
  onSelectTeam,
  onClose,
}) => {
  const availableSeasons = Object.keys(driver.seasons)
    .map(Number)
    .sort((a, b) => b - a);
  const [modalSeason, setModalSeason] = useState<number>(
    driver.seasons[selectedSeason] ? selectedSeason : availableSeasons[0] || 2026
  );
  const [activeInterview, setActiveInterview] = useState<DriverInterviewItem | null>(null);

  const seasonStats = getDriverSeasonStats(driver.id, modalSeason);
  const careerStats = getDriverCareerStats(driver.id);
  const team =
    TEAMS_2026.find(
      (t) => t.id === (seasonStats.teamId !== 'unknown' ? seasonStats.teamId : driver.currentTeamId)
    ) || TEAMS_2026[0];

  const ext = getDriverExtendedMetadata(driver.id, driver.fullName, driver.currentTeamId);
  const teamGov = TEAM_GOVERNANCE_AND_MEDIA[team.id];
  const interviews = getDriverInterviews(
    driver.id,
    driver.fullName,
    team.fullName,
    resolveWikimediaCdnUrl(ext.media.imageUrl),
    resolveWikimediaCdnUrl(teamGov?.carMedia.imageUrl || ext.media.imageUrl)
  );
  const teammate = DRIVERS_DATA.find((d) => d.id === ext.teammateId);

  const currentIdx = DRIVERS_DATA.findIndex((d) => d.id === driver.id);
  const prevDriver =
    DRIVERS_DATA[(currentIdx - 1 + DRIVERS_DATA.length) % DRIVERS_DATA.length];
  const nextDriver = DRIVERS_DATA[(currentIdx + 1) % DRIVERS_DATA.length];

  return (
    <div
      className="fixed inset-0 z-50 w-screen h-screen overflow-hidden bg-[#06080D] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-labelledby="driver-modal-title"
      data-testid="driver-full-profile-modal"
    >
      {/* FULL-SCREEN CINEMATIC DRIVER PHOTOGRAPH BACKDROP (Pinned Across Viewport) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <img
          src={resolveWikimediaCdnUrl(ext.media.imageUrl)}
          alt={driver.fullName}
          className="w-full h-full object-cover object-[center_18%] animate-heroZoom opacity-65"
        />
        {/* Multi-layered cinematic dark gradients preserving portrait visibility & foreground contrast */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 75% 22%, transparent 0%, rgba(7, 9, 13, 0.72) 58%, rgba(7, 9, 13, 0.94) 100%),
              linear-gradient(90deg, rgba(7, 9, 13, 0.9) 0%, rgba(7, 9, 13, 0.52) 50%, rgba(7, 9, 13, 0.84) 100%),
              linear-gradient(180deg, rgba(7, 9, 13, 0.3) 0%, rgba(7, 9, 13, 0.74) 55%, rgba(7, 9, 13, 0.95) 100%)
            `,
          }}
        />
        {/* Subtle constructor color ambient rim light */}
        <div
          className="absolute -top-24 right-12 w-[520px] h-[520px] rounded-full blur-3xl opacity-30"
          style={{ background: `radial-gradient(circle, ${team.color} 0%, transparent 70%)` }}
        />
      </div>

      {/* Fixed Translucent Glass Top Navigation Bar */}
      <div className="relative z-30 shrink-0 f1-glass-overlay border-b border-white/15 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              data-testid="close-driver-profile"
              aria-label="Close driver profile modal"
              className="px-4 py-2 rounded-xl bg-[#E10600] hover:bg-[#ff1e17] text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#E10600]/30 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Drivers</span>
            </button>

            <div className="hidden sm:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onSelectDriver(prevDriver.id)}
                className="px-3 py-2 rounded-xl f1-glass-pill hover:border-white/35 text-xs text-gray-200 flex items-center gap-1 cursor-pointer transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{prevDriver.lastName}</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectDriver(nextDriver.id)}
                className="px-3 py-2 rounded-xl f1-glass-pill hover:border-white/35 text-xs text-gray-200 flex items-center gap-1 cursor-pointer transition-all"
              >
                <span>{nextDriver.lastName}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onToggleFavorite(driver.id)}
              aria-label={
                isFavorite
                  ? `Remove ${driver.fullName} from favorites`
                  : `Add ${driver.fullName} to favorites`
              }
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-[#E10600]/25 border border-[#E10600] text-white'
                  : 'f1-glass-pill text-gray-200 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#E10600] text-[#E10600]' : ''}`} />
              <span>{isFavorite ? 'Saved in Favorites' : 'Favorite Driver'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Exit driver profile"
              className="p-2 rounded-xl f1-glass-pill hover:bg-[#E10600] text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Scrollable Full-Screen Content Container Over the Pinned Photograph */}
      <div className="relative z-10 flex-1 overflow-y-auto" data-testid="driver-modal-scroll-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-8">
        {/* Hero Split: Left Glass Identity Overlay + Right Framed Portrait Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7 f1-glass-overlay rounded-2xl p-6 sm:p-8 border-t-2" style={{ borderTopColor: team.color }}>
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono-tech uppercase tracking-widest mb-3">
              <span className="font-bold px-2.5 py-1 rounded bg-white/10 text-white" style={{ color: team.color }}>
                #{driver.number} • {driver.code} • {driver.nationality}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Official FIA &amp; Wikimedia Verified
              </span>
              {(careerStats.worldChampionships ?? 0) > 0 && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-amber-300 font-bold">
                    {careerStats.worldChampionships}x World Champion
                  </span>
                </>
              )}
            </div>

            <p className="text-sm sm:text-base uppercase tracking-[0.22em] text-gray-300 font-semibold">
              {driver.firstName}
            </p>
            <h1
              id="driver-modal-title"
              className="text-5xl sm:text-7xl font-display font-bold tracking-tight text-white mt-1 leading-none"
            >
              {driver.lastName}
            </h1>

            <p className="text-sm sm:text-base text-gray-200 leading-relaxed mt-5">
              {driver.bio}
            </p>

            {/* Quick Identity Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/15">
              <div>
                <span className="text-[10px] font-mono-tech uppercase text-gray-400 block">2026 Constructor</span>
                <button
                  type="button"
                  onClick={() => onSelectTeam(team.id)}
                  className="text-sm font-bold text-white hover:text-[#E10600] transition-colors text-left cursor-pointer mt-0.5 underline decoration-white/30"
                >
                  {team.name}
                </button>
              </div>
              <div>
                <span className="text-[10px] font-mono-tech uppercase text-gray-400 block">Date of Birth</span>
                <span className="text-sm font-mono-tech font-semibold text-white mt-0.5 block">
                  {driver.dateOfBirth}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono-tech uppercase text-gray-400 block">Place of Birth</span>
                <span className="text-sm font-semibold text-white mt-0.5 block truncate">
                  {driver.placeOfBirth}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono-tech uppercase text-gray-400 block">Career Era</span>
                <span className="text-sm font-mono-tech font-semibold text-[#27F4D2] mt-0.5 block">
                  {ext.careerTimeline[0]?.year || '2026'}
                </span>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: High-Resolution Framed Portrait Showcase with Image-Aware Face Positioning */}
          <div className="lg:col-span-5 f1-glass-panel p-3 overflow-hidden" style={{ borderTop: `3px solid ${team.color}` }}>
            <VerifiedMediaImage
              media={ext.media}
              alt={driver.fullName}
              accentColor={team.color}
              badgeText={`2026 P${driver.seasons[2026]?.position ?? '-'} • #${driver.number}`}
              objectPosition={ext.objectPosition || 'center 14%'}
              containerClassName="h-[380px] sm:h-[420px] w-full rounded-xl"
              imgClassName="object-cover"
            />
          </div>
        </div>

        {/* Season Selector & Strictly Separated Statistics (Selected Season vs Career Totals vs Sprint) */}
        <div className="f1-glass-panel p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-5">
            <div>
              <span className="text-[11px] font-mono-tech uppercase tracking-widest text-[#E10600] block">
                Verified Telemetry &amp; Championship Audit
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mt-0.5">
                Season vs. Career Statistical Breakdown
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <label htmlFor="modal-season-select" className="text-xs font-mono-tech uppercase text-gray-300">
                Inspect Season:
              </label>
              <select
                id="modal-season-select"
                data-testid="modal-season-select"
                value={modalSeason}
                onChange={(e) => setModalSeason(Number(e.target.value))}
                className="f1-glass-input rounded-xl px-4 py-2 text-sm font-bold text-white cursor-pointer"
              >
                {availableSeasons.map((yr) => (
                  <option key={yr} value={yr} className="bg-[#0B0D12] text-white">
                    {yr} Championship Season
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Selected Season Card */}
            <div className="f1-glass-overlay rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                  <Flag className="w-4 h-4 text-[#E10600]" />
                  <span>{modalSeason} Season Statistics</span>
                </h3>
                <span className="text-[11px] font-mono-tech uppercase text-[#E10600]">Single Season</span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                  <span className="text-gray-300">{modalSeason} Championship Standing</span>
                  <span className="font-mono-tech font-bold text-xl text-white" data-testid="modal-season-position">
                    {seasonStats.position !== null ? `P${seasonStats.position}` : 'Unavailable'}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                  <span className="text-gray-300">{modalSeason} Season Points (Incl. Sprint)</span>
                  <span className="font-mono-tech font-bold text-2xl text-[#E10600]" data-testid="modal-season-points">
                    {formatStatValue(seasonStats.points)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                  <span className="text-gray-300">{modalSeason} Grand Prix Wins</span>
                  <span className="font-mono-tech font-bold text-lg text-white" data-testid="modal-season-wins">
                    {formatStatValue(seasonStats.gpWins)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                  <span className="text-gray-300">{modalSeason} Grand Prix Podiums</span>
                  <span className="font-mono-tech font-bold text-lg text-white" data-testid="modal-season-podiums">
                    {formatStatValue(seasonStats.gpPodiums)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                  <span className="text-gray-300">{modalSeason} Pole Positions</span>
                  <span className="font-mono-tech font-bold text-lg text-white" data-testid="modal-season-poles">
                    {formatStatValue(seasonStats.gpPoles)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">{modalSeason} Grand Prix Entries / DNF</span>
                  <span className="font-mono-tech font-bold text-sm text-gray-200">
                    {formatStatValue(seasonStats.gpEntries)} Starts • {formatStatValue(seasonStats.dnfs)} DNF
                  </span>
                </div>
              </div>
            </div>

            {/* Career Totals Card */}
            <div className="f1-glass-overlay rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-emerald-400" />
                  <span>All-Time Career Totals</span>
                </h3>
                <span className="text-[11px] font-mono-tech uppercase text-emerald-400">Lifetime Record</span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                  <span className="text-gray-300">World Drivers’ Championships</span>
                  <span className="font-mono-tech font-bold text-xl text-emerald-400" data-testid="modal-career-titles">
                    {formatStatValue(careerStats.worldChampionships)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                  <span className="text-gray-300">Career Championship Points</span>
                  <span className="font-mono-tech font-bold text-2xl text-white" data-testid="modal-career-points">
                    {formatStatValue(careerStats.points)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                  <span className="text-gray-300">Career Grand Prix Wins</span>
                  <span className="font-mono-tech font-bold text-lg text-white" data-testid="modal-career-wins">
                    {formatStatValue(careerStats.gpWins)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                  <span className="text-gray-300">Career Grand Prix Podiums</span>
                  <span className="font-mono-tech font-bold text-lg text-white" data-testid="modal-career-podiums">
                    {formatStatValue(careerStats.gpPodiums)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                  <span className="text-gray-300">Career Pole Positions</span>
                  <span className="font-mono-tech font-bold text-lg text-white" data-testid="modal-career-poles">
                    {formatStatValue(careerStats.gpPoles)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Career Entries / Fastest Laps</span>
                  <span className="font-mono-tech font-bold text-sm text-gray-200" data-testid="modal-career-entries">
                    {formatStatValue(careerStats.gpEntries)} Starts • {formatStatValue(careerStats.fastestLaps)} FL
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sprint Classification Bar */}
          <div className="f1-glass-overlay rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono-tech uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Sprint Race Telemetry (Separated from Grand Prix Totals)
              </span>
              <span className="text-[11px] text-gray-400 font-mono-tech">FIA Sprint Format</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-[10px] text-gray-400 uppercase font-mono-tech">{modalSeason} Sprint Points</div>
                <div className="text-lg font-mono-tech font-bold text-amber-300 mt-0.5">
                  {formatStatValue(seasonStats.sprintPoints)}
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-[10px] text-gray-400 uppercase font-mono-tech">{modalSeason} Sprint Wins</div>
                <div className="text-lg font-mono-tech font-bold text-white mt-0.5">
                  {formatStatValue(seasonStats.sprintWins)}
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-[10px] text-gray-400 uppercase font-mono-tech">{modalSeason} Sprint Podiums</div>
                <div className="text-lg font-mono-tech font-bold text-white mt-0.5">
                  {formatStatValue(seasonStats.sprintPodiums)}
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-[10px] text-gray-400 uppercase font-mono-tech">Career Sprint Wins</div>
                <div className="text-lg font-mono-tech font-bold text-white mt-0.5">
                  {formatStatValue(careerStats.sprintWins)}
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-[10px] text-gray-400 uppercase font-mono-tech">Career Sprint Points</div>
                <div className="text-lg font-mono-tech font-bold text-white mt-0.5">
                  {formatStatValue(careerStats.sprintPoints)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Career Timeline, Achievements & Teammate / Social Channels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 f1-glass-panel p-6 space-y-4">
            <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#E10600]" />
              <span>Chronological Career Timeline</span>
            </h3>
            <div className="space-y-3.5">
              {ext.careerTimeline.map((item) => (
                <div key={item.year} className="f1-glass-overlay rounded-xl p-4">
                  <div className="text-xs font-mono-tech font-bold text-[#E10600] uppercase">
                    {item.year} • {item.team}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-200 mt-1 leading-relaxed">{item.milestone}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 f1-glass-panel p-6 space-y-4">
            <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Verified Career Honours</span>
            </h3>
            <ul className="space-y-3">
              {ext.achievements.map((ach) => (
                <li key={ach} className="f1-glass-overlay rounded-xl p-3.5 flex items-start gap-2.5 text-xs sm:text-sm text-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{ach}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {teammate && (
              <div className="f1-glass-panel p-6 space-y-3">
                <span className="text-[10px] font-mono-tech uppercase tracking-widest text-gray-400 block">
                  2026 Constructor Teammate
                </span>
                <button
                  type="button"
                  onClick={() => onSelectDriver(teammate.id)}
                  className="w-full f1-glass-overlay hover:border-[#E10600] rounded-xl p-4 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tech text-xs font-bold text-[#E10600]">#{teammate.number}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div className="text-lg font-display font-bold text-white mt-1">{teammate.fullName}</div>
                  <div className="text-xs text-gray-300 mt-1 font-mono-tech">
                    2026: P{teammate.seasons[2026]?.position} • {teammate.seasons[2026]?.points} pts
                  </div>
                </button>
              </div>
            )}

            <div className="f1-glass-panel p-6 space-y-3">
              <span className="text-[10px] font-mono-tech uppercase tracking-widest text-gray-400 block">
                Verified Driver Channels
              </span>
              <div className="flex flex-col gap-2">
                <a
                  href={ext.socials.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="f1-glass-overlay hover:border-white/40 rounded-xl px-4 py-2.5 text-xs font-semibold text-white flex items-center justify-between transition-all"
                >
                  <span>Official X (Twitter)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </a>
                <a
                  href={ext.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="f1-glass-overlay hover:border-white/40 rounded-xl px-4 py-2.5 text-xs font-semibold text-white flex items-center justify-between transition-all"
                >
                  <span>Official Instagram</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </a>
                <a
                  href={ext.socials.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="f1-glass-overlay hover:border-white/40 rounded-xl px-4 py-2.5 text-xs font-semibold text-white flex items-center justify-between transition-all"
                >
                  <span>Official Driver Hub</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================================
            RELATED RACING PHOTOGRAPHS & CONSTRUCTOR CAR IMAGERY GALLERY
            ==================================================================== */}
        <div className="f1-glass-panel p-6 sm:p-8 space-y-5" data-testid="driver-related-photography">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/15 pb-4">
            <div>
              <span className="text-[11px] font-mono-tech uppercase tracking-widest text-[#E10600] block">
                Verified Editorial &amp; Trackside Photography
              </span>
              <h2 className="text-2xl font-display font-bold text-white mt-0.5">
                Related Racing Photographs &amp; {team.chassis2026} Machinery
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onSelectTeam(team.id)}
              className="px-3.5 py-2 rounded-xl f1-glass-pill hover:border-[#E10600] text-xs font-semibold text-white flex items-center gap-2 self-start sm:self-auto cursor-pointer"
            >
              <span>Open {team.name} Technical Profile</span>
              <ChevronRight className="w-4 h-4 text-[#E10600]" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Official Driver Portrait */}
            <div className="f1-glass-overlay rounded-2xl p-3 space-y-2.5">
              <VerifiedMediaImage
                media={ext.media}
                alt={`${driver.fullName} — Paddock Portrait`}
                accentColor={team.color}
                badgeText="Official Driver Portrait"
                fallbackType="driver"
                objectPosition={ext.objectPosition || 'center 16%'}
                containerClassName="h-56 w-full rounded-xl"
              />
              <div className="px-1">
                <div className="text-xs font-bold text-white">{driver.fullName} — Paddock Portrait</div>
                <p className="text-[11px] text-gray-300 line-clamp-2 mt-0.5">{ext.media.caption}</p>
              </div>
            </div>

            {/* Card 2: Related Racing Action / Trackside Feature */}
            <div className="f1-glass-overlay rounded-2xl p-3 space-y-2.5">
              <VerifiedMediaImage
                media={ext.actionMedia || teamGov?.carMedia || ext.media}
                alt={`${driver.fullName} — Grand Prix Track Action`}
                accentColor={team.color}
                badgeText="Grand Prix Track Action"
                fallbackType="car"
                objectPosition="center center"
                containerClassName="h-56 w-full rounded-xl"
              />
              <div className="px-1">
                <div className="text-xs font-bold text-white">{driver.fullName} — Trackside &amp; Race Action</div>
                <p className="text-[11px] text-gray-300 line-clamp-2 mt-0.5">
                  {(ext.actionMedia || teamGov?.carMedia || ext.media).caption}
                </p>
              </div>
            </div>

            {/* Card 3: 2026 Constructor Challenger */}
            {teamGov && (
              <div className="f1-glass-overlay rounded-2xl p-3 space-y-2.5">
                <VerifiedMediaImage
                  media={teamGov.carMedia}
                  alt={`${team.name} ${team.chassis2026}`}
                  accentColor={team.color}
                  badgeText={`${team.chassis2026} • ${team.powerUnit}`}
                  fallbackType="car"
                  objectPosition="center center"
                  containerClassName="h-56 w-full rounded-xl"
                />
                <div className="px-1">
                  <div className="text-xs font-bold text-white">
                    {team.name} — {team.chassis2026} ({team.powerUnit})
                  </div>
                  <p className="text-[11px] text-gray-300 line-clamp-2 mt-0.5">{teamGov.carMedia.caption}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ====================================================================
            DEDICATED AUTHENTIC "INTERVIEWS & MEDIA" SECTION
            ==================================================================== */}
        <div className="f1-glass-panel p-6 sm:p-8 space-y-6" data-testid="driver-interviews-section">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-5">
            <div>
              <span className="text-[11px] font-mono-tech uppercase tracking-widest text-[#E10600] flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5" /> Official Formula 1, FIA Press Conference &amp; Team Media
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
                Interviews &amp; Media — {driver.fullName}
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                Authentic interviews, FIA press conferences, and official team features for {driver.fullName}. Click any card to inspect the media briefing or launch the official source stream.
              </p>
            </div>
            <a
              href={`https://www.youtube.com/@Formula1/search?query=${encodeURIComponent(driver.fullName + ' Interview')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl f1-glass-pill hover:border-[#E10600] text-xs font-semibold text-white flex items-center gap-2 shrink-0 transition-all"
            >
              <Video className="w-4 h-4 text-[#E10600]" />
              <span>Official F1 Video Archive</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </a>
          </div>

          {/* Active Interview Preview Drawer (when user clicks "Preview Briefing" on any card) */}
          {activeInterview && (
            <div className="f1-glass-overlay rounded-2xl p-6 border border-[#E10600]/50 animate-fadeIn">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-72 h-44 rounded-xl overflow-hidden relative shrink-0 border border-white/15">
                  <img
                    src={activeInterview.thumbnailUrl}
                    alt={activeInterview.title}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-center justify-center">
                    <a
                      href={activeInterview.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-full bg-[#E10600] hover:bg-[#ff1e17] text-white text-xs font-bold flex items-center gap-2 shadow-xl"
                    >
                      <Play className="w-4 h-4 fill-white" /> Watch on Official Source
                    </a>
                  </div>
                </div>
                <div className="flex-1 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono-tech uppercase text-[#27F4D2]">
                      {activeInterview.category} • {activeInterview.publisher}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveInterview(null)}
                      className="text-xs text-gray-400 hover:text-white cursor-pointer"
                    >
                      Close Preview ✕
                    </button>
                  </div>
                  <h3 className="text-xl font-display font-bold text-white">{activeInterview.title}</h3>
                  <p className="text-xs text-gray-400 font-mono-tech">
                    Featured Driver: <strong className="text-white">{activeInterview.driverName}</strong> • Published: {activeInterview.date} • Duration: {activeInterview.duration}
                  </p>
                  <p className="text-sm text-gray-200 leading-relaxed">{activeInterview.topicSummary}</p>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <a
                      href={activeInterview.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#E10600] hover:bg-[#ff1e17] text-white text-xs font-bold inline-flex items-center gap-2 transition-all"
                    >
                      <span>Open Original Interview ({activeInterview.publisher})</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3 Interview Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {interviews.map((item) => (
              <div
                key={item.id}
                data-testid={`interview-card-${item.id}`}
                className="f1-glass-overlay rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-white/35 transition-all"
              >
                <div>
                  <div
                    className="relative h-48 overflow-hidden cursor-pointer"
                    onClick={() => setActiveInterview(item)}
                  >
                    <VerifiedMediaImage
                      media={{
                        imageUrl: item.thumbnailUrl,
                        author: item.publisher,
                        license: 'CC BY-SA 4.0',
                        sourceUrl: item.sourceUrl,
                        caption: item.title,
                      }}
                      alt={item.title}
                      accentColor={team.color}
                      badgeText={item.category}
                      fallbackType="driver"
                      className="w-full h-full"
                      showAttributionBar={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07090D] via-[#07090D]/30 to-transparent" />
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono-tech">
                      <span className="px-2.5 py-1 rounded-md f1-glass-pill text-white font-semibold">
                        {item.category}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-black/75 text-gray-200">
                        {item.duration}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[11px] font-mono-tech text-[#27F4D2] font-semibold truncate">
                        {item.driverName}
                      </span>
                      <span className="w-8 h-8 rounded-full bg-[#E10600] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="text-[11px] font-mono-tech text-gray-400">
                      {item.publisher} • {item.date}
                    </div>
                    <h3 className="text-base font-display font-bold text-white leading-snug group-hover:text-[#E10600] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
                      {item.topicSummary}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setActiveInterview(item)}
                    className="text-xs font-semibold text-gray-200 hover:text-white cursor-pointer flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 text-[#E10600]" />
                    <span>Preview Briefing</span>
                  </button>
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#E10600]/20 hover:bg-[#E10600] border border-[#E10600]/40 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <span>Watch Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

interface TeamModalProps {
  team: TeamProfile;
  isFavorite: boolean;
  onToggleFavorite: (teamId: string) => void;
  onSelectDriver: (driverId: string) => void;
  onClose: () => void;
}

export const TeamModal: React.FC<TeamModalProps> = ({
  team,
  isFavorite,
  onToggleFavorite,
  onSelectDriver,
  onClose,
}) => {
  const teamDrivers = DRIVERS_DATA.filter((d) => team.drivers.includes(d.id));
  const gov = TEAM_GOVERNANCE_AND_MEDIA[team.id];

  return (
    <div
      className="fixed inset-0 z-50 w-screen h-screen overflow-hidden bg-[#06080D] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-labelledby="team-modal-title"
      data-testid="team-full-profile-modal"
    >
      {/* FULL-SCREEN CONSTRUCTOR CAR PHOTOGRAPH BACKDROP */}
      {gov && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <img
            src={resolveWikimediaCdnUrl(gov.carMedia.imageUrl)}
            alt={`${team.name} — ${team.chassis2026}`}
            className="w-full h-full object-cover object-center animate-heroZoom opacity-60"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 75% 25%, transparent 0%, rgba(7, 9, 13, 0.76) 60%, rgba(7, 9, 13, 0.95) 100%),
                linear-gradient(180deg, rgba(7, 9, 13, 0.4) 0%, rgba(7, 9, 13, 0.8) 55%, rgba(7, 9, 13, 0.96) 100%)
              `,
            }}
          />
        </div>
      )}

      {/* Fixed Glass Header */}
      <div className="relative z-30 shrink-0 f1-glass-overlay border-b border-white/15 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close constructor modal"
            className="px-4 py-2 rounded-xl bg-[#E10600] hover:bg-[#ff1e17] text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Constructors</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onToggleFavorite(team.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-[#E10600]/25 border border-[#E10600] text-white'
                  : 'f1-glass-pill text-gray-200 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#E10600] text-[#E10600]' : ''}`} />
              <span>{isFavorite ? 'Saved Constructor' : 'Favorite Constructor'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Exit constructor modal"
              className="p-2 rounded-xl f1-glass-pill hover:bg-[#E10600] text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Over Full-Screen Car Backdrop */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Hero Split: Constructor Identity Overlay + Car Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-6 f1-glass-overlay rounded-2xl p-6 sm:p-8 border-t-2" style={{ borderTopColor: team.color }}>
            <span
              className="px-3 py-1 rounded text-xs font-mono-tech font-bold text-black uppercase inline-block"
              style={{ backgroundColor: team.color }}
            >
              2026 P{team.season2026Position} • {team.chassis2026} • {team.powerUnit}
            </span>
            <h1 id="team-modal-title" className="text-4xl sm:text-6xl font-display font-bold text-white mt-3">
              {team.name}
            </h1>
            <p className="text-sm text-gray-300 font-mono-tech mt-1">{team.fullName}</p>
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed mt-4">{team.overview}</p>
            {gov && <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mt-3">{gov.historySummary}</p>}
          </div>

          {gov && (
            <div className="lg:col-span-6 f1-glass-panel p-3 overflow-hidden">
              <VerifiedMediaImage
                media={gov.carMedia}
                alt={`${team.name} — ${team.chassis2026}`}
                accentColor={team.color}
                badgeText={`${team.chassis2026} • ${team.powerUnit}`}
                fallbackType="car"
                containerClassName="h-[300px] sm:h-[340px] w-full rounded-xl"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left 4 Columns: Strictly Separated Governance */}
          <div className="lg:col-span-4 space-y-6">
            <div className="f1-glass-panel p-6 space-y-4 text-sm">
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#E10600]" />
                <span>Leadership &amp; Governance</span>
              </h3>
              <div className="f1-glass-overlay rounded-xl p-3.5">
                <p className="text-[10px] font-mono-tech text-gray-400 uppercase">Team Principal (Sporting)</p>
                <p className="font-bold text-base text-white mt-0.5">{gov?.teamPrincipal || team.principal}</p>
              </div>
              <div className="f1-glass-overlay rounded-xl p-3.5">
                <p className="text-[10px] font-mono-tech text-gray-400 uppercase">Chief Executive Officer (CEO)</p>
                <p className="font-bold text-white mt-0.5">{gov?.ceo}</p>
              </div>
              <div className="f1-glass-overlay rounded-xl p-3.5">
                <p className="text-[10px] font-mono-tech text-gray-400 uppercase">Ownership Structure</p>
                <p className="text-gray-200 text-xs mt-0.5 leading-relaxed">{gov?.ownershipStructure}</p>
              </div>
              <div className="f1-glass-overlay rounded-xl p-3.5">
                <p className="text-[10px] font-mono-tech text-gray-400 uppercase">Title / Principal Partner</p>
                <p className="font-bold text-emerald-400 mt-0.5">{gov?.titleSponsor}</p>
              </div>
              <div className="f1-glass-overlay rounded-xl p-3.5">
                <p className="text-[10px] font-mono-tech text-gray-400 uppercase">Technical Director &amp; Base</p>
                <p className="font-bold text-white mt-0.5">{team.technicalDirector}</p>
                <p className="text-xs text-gray-300 mt-1">{gov?.headquarters || team.base}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">PU: {gov?.powerUnitFacility}</p>
              </div>
            </div>

            {gov && (
              <div className="f1-glass-panel p-6 space-y-3">
                <h3 className="text-lg font-display font-bold text-white">Official Constructor Channels</h3>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={gov.socials.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="f1-glass-overlay hover:border-white/40 px-3.5 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5"
                  >
                    <span>X (Twitter)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={gov.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="f1-glass-overlay hover:border-white/40 px-3.5 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5"
                  >
                    <span>Instagram</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={gov.socials.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="f1-glass-overlay hover:border-white/40 px-3.5 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5"
                  >
                    <span>Official Team Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right 8 Columns: Standings, Heritage & Interactive Driver Pair */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="f1-glass-panel p-6 space-y-3">
                <h3 className="text-lg font-display font-bold text-white">2026 Constructor Standings</h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-300">2026 Championship Position</span>
                    <span className="font-mono-tech font-bold text-white">P{team.season2026Position}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-300">2026 Season Points</span>
                    <span className="font-mono-tech font-bold text-[#E10600] text-lg">{team.season2026Points}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-300">2026 Grand Prix Wins</span>
                    <span className="font-mono-tech font-bold text-white">{team.season2026Wins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">2026 Podiums</span>
                    <span className="font-mono-tech font-bold text-white">{team.season2026Podiums}</span>
                  </div>
                </div>
              </div>

              <div className="f1-glass-panel p-6 space-y-3">
                <h3 className="text-lg font-display font-bold text-white">All-Time Constructor Heritage</h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-300">World Constructors’ Titles</span>
                    <span className="font-mono-tech font-bold text-emerald-400 text-lg">{team.worldChampionships}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-300">Career Grand Prix Wins</span>
                    <span className="font-mono-tech font-bold text-white">{team.careerWins}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-300">Career Pole Positions</span>
                    <span className="font-mono-tech font-bold text-white">{team.careerPoles}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">First Championship Entry</span>
                    <span className="font-mono-tech font-bold text-white">{team.firstEntry}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2026 Driver Lineup with Photo Cards */}
            <div className="f1-glass-panel p-6 space-y-4">
              <h3 className="text-xl font-display font-bold text-white">2026 Official Driver Lineup</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {teamDrivers.map((d) => {
                  const s26 = d.seasons[2026];
                  const dExt = getDriverExtendedMetadata(d.id, d.fullName, d.currentTeamId);
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => onSelectDriver(d.id)}
                      className="f1-glass-overlay rounded-2xl overflow-hidden text-left transition-all hover:border-white/40 group cursor-pointer"
                    >
                      <div className="h-52 overflow-hidden relative bg-[#07090D]">
                        <img
                          src={resolveWikimediaCdnUrl(dExt.media.imageUrl)}
                          alt={d.fullName}
                          style={{ objectPosition: dExt.objectPosition || 'center 16%' }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#07090D] via-transparent to-transparent" />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded f1-glass-pill text-xs font-mono-tech font-bold text-white">
                          #{d.number} • P{s26?.position}
                        </span>
                      </div>
                      <div className="p-4">
                        <h4 className="text-xl font-display font-bold text-white group-hover:text-[#E10600] transition-colors">
                          {d.fullName}
                        </h4>
                        <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-white/10 text-xs font-mono-tech">
                          <div>
                            <span className="text-gray-400 block text-[10px]">2026 Pts</span>
                            <span className="font-bold text-[#E10600]">{s26?.points}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[10px]">2026 Wins</span>
                            <span className="font-bold text-white">{s26?.gpWins}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[10px]">Career Wins</span>
                            <span className="font-bold text-white">{d.career.gpWins}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

interface CircuitModalProps {
  circuit: CircuitProfile;
  units: 'metric' | 'imperial';
  onClose: () => void;
}

export const CircuitModal: React.FC<CircuitModalProps> = ({ circuit, units, onClose }) => {
  const ext = CIRCUIT_EXTENDED_PROFILES[circuit.id] || CIRCUIT_EXTENDED_PROFILES.monza;
  const [selectedTurnIdx, setSelectedTurnIdx] = useState<number>(0);
  const activeTurn = ext.turns[selectedTurnIdx] || ext.turns[0];

  return (
    <div
      className="fixed inset-0 z-50 w-screen h-screen overflow-hidden bg-[#06080D] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-labelledby="circuit-modal-title"
    >
      {/* Full-Screen Circuit Photograph Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <img
          src={resolveWikimediaCdnUrl(ext.media.imageUrl)}
          alt={circuit.name}
          className="w-full h-full object-cover object-center animate-heroZoom opacity-50"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(7, 9, 13, 0.6) 0%, rgba(7, 9, 13, 0.85) 55%, rgba(7, 9, 13, 0.96) 100%)',
          }}
        />
      </div>

      <div className="relative z-30 shrink-0 f1-glass-overlay border-b border-white/15 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back to circuit gallery"
            className="px-4 py-2 rounded-xl bg-[#E10600] hover:bg-[#ff1e17] text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Circuit Gallery</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close circuit profile"
            className="p-2 rounded-xl f1-glass-pill hover:bg-[#E10600] text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        <div className="f1-glass-overlay rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-mono-tech uppercase tracking-widest text-[#E10600] block">
              {circuit.country} • {circuit.location} • First Held {circuit.firstGrandPrix}
            </span>
            <h1 id="circuit-modal-title" className="text-3xl sm:text-5xl font-display font-bold text-white mt-1">
              {circuit.name}
            </h1>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="f1-glass-panel px-4 py-3">
              <span className="text-[10px] font-mono-tech uppercase text-gray-400 block">Track Length</span>
              <span className="font-mono-tech font-bold text-lg text-white">
                {units === 'metric'
                  ? `${circuit.lengthKm} km`
                  : `${(circuit.lengthKm * 0.621371).toFixed(3)} mi`}
              </span>
            </div>
            <div className="f1-glass-panel px-4 py-3">
              <span className="text-[10px] font-mono-tech uppercase text-gray-400 block">Race Laps</span>
              <span className="font-mono-tech font-bold text-lg text-white">{circuit.laps}</span>
            </div>
            <div className="f1-glass-panel px-4 py-3">
              <span className="text-[10px] font-mono-tech uppercase text-gray-400 block">Turns / X-Zones</span>
              <span className="font-mono-tech font-bold text-lg text-white">
                {circuit.turns} / {circuit.drsOrActiveAeroZones}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive SVG Track Map + Turn Marker Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
          <div className="lg:col-span-3 f1-glass-panel p-6 relative">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-mono-tech uppercase tracking-wider text-gray-300">
                Interactive SVG Track Geometry — Click Any Corner Marker
              </span>
              <span className="text-xs font-mono-tech text-emerald-400">Animated Telemetry Trace</span>
            </div>

            <svg
              viewBox="0 0 460 280"
              className="w-full h-64 sm:h-72 overflow-visible"
              role="img"
              aria-label={`${circuit.name} interactive track layout`}
            >
              <path
                d={ext.svgPath}
                fill="none"
                stroke="rgba(225, 6, 0, 0.25)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={ext.svgPath}
                fill="none"
                stroke="#ffffff"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={ext.svgPath}
                fill="none"
                stroke="#E10600"
                strokeWidth="2.5"
                className="animate-aero-stream"
              />
              <circle
                cx={ext.startFinishCoord.x}
                cy={ext.startFinishCoord.y}
                r="6"
                fill="#27F4D2"
                stroke="#000"
                strokeWidth="2"
              />
              {ext.turns.map((t, idx) => {
                const isSelected = idx === selectedTurnIdx;
                return (
                  <g
                    key={t.turn}
                    onClick={() => setSelectedTurnIdx(idx)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={t.x}
                      cy={t.y}
                      r={isSelected ? 13 : 9}
                      fill={isSelected ? '#E10600' : '#0D1117'}
                      stroke={isSelected ? '#ffffff' : '#E10600'}
                      strokeWidth="2.5"
                    />
                    <text
                      x={t.x}
                      y={t.y + 4}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      T{t.turn}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="flex flex-wrap gap-2 mt-4">
              {ext.turns.map((t, idx) => (
                <button
                  key={t.turn}
                  type="button"
                  onClick={() => setSelectedTurnIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    idx === selectedTurnIdx
                      ? 'bg-[#E10600] text-white'
                      : 'f1-glass-pill text-gray-300 hover:text-white'
                  }`}
                >
                  Turn {t.turn}: {t.name}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 f1-glass-panel p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono-tech uppercase tracking-widest text-[#E10600] font-bold">
                Corner Telemetry Inspector
              </span>
              <span className="px-2.5 py-0.5 f1-glass-pill rounded text-xs font-mono-tech">
                Turn {activeTurn.turn}
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold text-white">{activeTurn.name}</h2>
            <p className="text-sm text-gray-200 leading-relaxed">{activeTurn.note}</p>

            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10 text-center">
              <div className="f1-glass-overlay p-3 rounded-xl">
                <span className="text-[10px] font-mono-tech text-gray-400 block">Apex Speed</span>
                <span className="font-mono-tech font-bold text-base text-white">
                  {units === 'metric'
                    ? `${activeTurn.minSpeedKmh} km/h`
                    : `${Math.round(activeTurn.minSpeedKmh * 0.621371)} mph`}
                </span>
              </div>
              <div className="f1-glass-overlay p-3 rounded-xl">
                <span className="text-[10px] font-mono-tech text-gray-400 block">Gear</span>
                <span className="font-mono-tech font-bold text-base text-[#E10600]">Gear {activeTurn.gear}</span>
              </div>
              <div className="f1-glass-overlay p-3 rounded-xl">
                <span className="text-[10px] font-mono-tech text-gray-400 block">Wing Mode</span>
                <span className="text-xs font-bold text-emerald-400 block mt-1">
                  {activeTurn.aeroMode.split(' ')[0]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Strictly Separated Lap Records */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="f1-glass-panel p-6">
            <p className="text-xs font-mono-tech uppercase tracking-wider text-[#E10600] font-bold">
              Official FIA Race Lap Record
            </p>
            <p className="text-3xl font-mono-tech font-bold text-white mt-2">{ext.raceLapRecord.time}</p>
            <p className="text-sm font-bold text-gray-100 mt-1">
              {ext.raceLapRecord.driver} ({ext.raceLapRecord.year})
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{ext.raceLapRecord.car}</p>
          </div>

          <div className="f1-glass-panel p-6">
            <p className="text-xs font-mono-tech uppercase tracking-wider text-amber-300 font-bold">
              All-Time Qualifying Record (Outright)
            </p>
            <p className="text-3xl font-mono-tech font-bold text-white mt-2">{ext.qualifyingRecord.time}</p>
            <p className="text-sm font-bold text-gray-100 mt-1">
              {ext.qualifyingRecord.driver} ({ext.qualifyingRecord.year})
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{ext.qualifyingRecord.car}</p>
          </div>

          <div className="f1-glass-panel p-6">
            <p className="text-xs font-mono-tech uppercase tracking-wider text-emerald-300 font-bold">
              2026 Event Fastest Lap
            </p>
            <p className="text-3xl font-mono-tech font-bold text-white mt-2">
              {ext.current2026FastestLap.time}
            </p>
            <p className="text-sm font-bold text-gray-100 mt-1">{ext.current2026FastestLap.driver}</p>
            <p className="text-xs text-gray-400 mt-0.5">{ext.current2026FastestLap.session}</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

interface F1AcademyDriverModalProps {
  driver: F1AcademySeriesProfile;
  onSelectDriver: (driver: F1AcademySeriesProfile) => void;
  onClose: () => void;
}

export const F1AcademyDriverModal: React.FC<F1AcademyDriverModalProps> = ({
  driver,
  onSelectDriver,
  onClose,
}) => {
  const currentIdx = F1_ACADEMY_SERIES_DRIVERS.findIndex((d) => d.id === driver.id);
  const prevDriver =
    F1_ACADEMY_SERIES_DRIVERS[
      (currentIdx - 1 + F1_ACADEMY_SERIES_DRIVERS.length) % F1_ACADEMY_SERIES_DRIVERS.length
    ];
  const nextDriver =
    F1_ACADEMY_SERIES_DRIVERS[(currentIdx + 1) % F1_ACADEMY_SERIES_DRIVERS.length];

  return (
    <div
      className="fixed inset-0 z-50 w-screen h-screen overflow-hidden bg-[#06080D] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-labelledby="academy-driver-modal-title"
      data-testid="academy-driver-full-profile-modal"
    >
      {/* Full-Screen Atmospheric Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <img
          src={resolveWikimediaCdnUrl(driver.carMedia?.imageUrl || driver.media.imageUrl)}
          alt={driver.name}
          className="w-full h-full object-cover object-center animate-heroZoom opacity-35"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 75% 22%, transparent 0%, rgba(7, 9, 13, 0.72) 55%, rgba(7, 9, 13, 0.95) 100%),
              linear-gradient(180deg, rgba(7, 9, 13, 0.45) 0%, rgba(7, 9, 13, 0.85) 60%, rgba(7, 9, 13, 0.98) 100%)
            `,
          }}
        />
      </div>

      {/* Fixed Top Glassmorphism Navigation Bar */}
      <div className="relative z-30 shrink-0 f1-glass-overlay border-b border-white/15 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              aria-label="Back to F1 Academy roster"
              className="px-4 py-2 rounded-xl bg-[#E10600] hover:bg-[#ff1e17] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to F1 Academy</span>
            </button>

            <div className="hidden md:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onSelectDriver(prevDriver)}
                className="px-3 py-1.5 rounded-lg f1-glass-pill text-xs text-gray-200 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{prevDriver.name.split(' ').slice(-1)[0]}</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectDriver(nextDriver)}
                className="px-3 py-1.5 rounded-lg f1-glass-pill text-xs text-gray-200 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <span>{nextDriver.name.split(' ').slice(-1)[0]}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline-block px-3 py-1 rounded-full f1-glass-pill text-[11px] font-mono-tech uppercase tracking-widest text-white">
              Official FIA F1 Academy Series Dossier
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close F1 Academy profile"
              className="p-2 rounded-xl f1-glass-pill hover:bg-[#E10600] text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Scrollable Dossier Content */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
          {/* Hero Split: Face-Visible Portrait Hero Card + Glassmorphism Profile Dossier */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
            {/* Left 5 Columns: Unobscured Driver Portrait Hero */}
            <div
              className="lg:col-span-5 f1-glass-panel p-2.5 overflow-hidden flex flex-col justify-between relative group"
              style={{ borderTop: `3px solid ${driver.teamColor}` }}
            >
              <div className="relative h-[420px] sm:h-[480px] w-full rounded-xl overflow-hidden bg-[#07090D]">
                <img
                  src={resolveWikimediaCdnUrl(driver.media.imageUrl)}
                  alt={driver.name}
                  style={{ objectPosition: driver.objectPosition || 'center 18%' }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, transparent 0%, rgba(6, 8, 13, 0.9) 100%)',
                  }}
                />
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                  <span
                    className="px-3 py-1 rounded-lg text-xs font-mono-tech font-bold text-black uppercase shadow-lg"
                    style={{ backgroundColor: driver.teamColor }}
                  >
                    #{driver.number} • {driver.f1SupportedBy.split('(')[0].trim()}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg f1-glass-pill text-[11px] font-mono-tech font-bold text-white">
                    {driver.nationality}
                  </span>
                </div>
                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-mono-tech uppercase tracking-widest text-gray-300 block">
                      F1 Academy Driver Portrait
                    </span>
                    <span className="text-xs font-mono-tech text-white/90 line-clamp-1">
                      {driver.media.caption}
                    </span>
                  </div>
                  <a
                    href={driver.media.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-md f1-glass-pill text-[10px] font-mono-tech text-gray-200 hover:text-white shrink-0 ml-2"
                  >
                    {driver.media.license}
                  </a>
                </div>
              </div>
            </div>

            {/* Right 7 Columns: Glassmorphism Identity, F1 Team Backing & Key Metrics */}
            <div
              className="lg:col-span-7 f1-glass-overlay rounded-2xl p-6 sm:p-8 border-t-2 flex flex-col justify-between space-y-6"
              style={{ borderTopColor: driver.teamColor }}
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className="px-3 py-1 rounded-md text-xs font-mono-tech font-bold text-black uppercase"
                    style={{ backgroundColor: driver.teamColor }}
                  >
                    {driver.f1SupportedBy}
                  </span>
                  <span className="px-3 py-1 rounded-md f1-glass-pill text-xs font-mono-tech text-white">
                    Operating Team: {driver.team}
                  </span>
                  <span className="px-3 py-1 rounded-md f1-glass-pill text-xs font-mono-tech text-gray-200">
                    {driver.nationality}
                  </span>
                </div>

                <div className="flex items-baseline justify-between gap-4">
                  <h1
                    id="academy-driver-modal-title"
                    className="text-4xl sm:text-6xl font-display font-bold text-white tracking-tight leading-none"
                  >
                    {driver.name}
                  </h1>
                  <span
                    className="text-5xl sm:text-7xl font-display font-bold leading-none opacity-85 shrink-0"
                    style={{ color: driver.teamColor }}
                  >
                    #{driver.number}
                  </span>
                </div>

                <div className="f1-glass-panel p-4 rounded-xl border-l-4" style={{ borderLeftColor: driver.teamColor }}>
                  <span className="text-[10px] font-mono-tech uppercase tracking-widest text-gray-400 block">
                    Formula 1 Constructor Academy Affiliation
                  </span>
                  <p className="text-base sm:text-lg font-display font-bold text-white mt-0.5">
                    {driver.f1SupportedBy} • {driver.team}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-gray-100 leading-relaxed">
                  {driver.bio}
                </p>

                <div className="flex flex-wrap gap-2.5 pt-1">
                  <a
                    href={driver.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl f1-glass-pill hover:border-white/40 text-xs font-semibold text-white flex items-center gap-1.5"
                  >
                    <span>Official Instagram</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-300" />
                  </a>
                  <a
                    href={driver.socials.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl f1-glass-pill hover:border-white/40 text-xs font-semibold text-white flex items-center gap-1.5"
                  >
                    <span>Official X</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-300" />
                  </a>
                  <a
                    href={driver.socials.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl f1-glass-pill hover:border-white/40 text-xs font-semibold text-white flex items-center gap-1.5"
                  >
                    <span>Official F1 Academy Hub</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-300" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/15">
                <div className="f1-glass-panel p-4 text-center">
                  <span className="text-[10px] font-mono-tech uppercase tracking-widest text-amber-300 block">
                    Season Points
                  </span>
                  <span className="text-3xl font-display font-bold text-white mt-1 block">
                    {driver.seasonPoints}
                  </span>
                </div>
                <div className="f1-glass-panel p-4 text-center">
                  <span className="text-[10px] font-mono-tech uppercase tracking-widest text-[#E10600] block">
                    Series Wins
                  </span>
                  <span className="text-3xl font-display font-bold text-white mt-1 block">
                    {driver.wins}
                  </span>
                </div>
                <div className="f1-glass-panel p-4 text-center">
                  <span className="text-[10px] font-mono-tech uppercase tracking-widest text-emerald-300 block">
                    Series Podiums
                  </span>
                  <span className="text-3xl font-display font-bold text-white mt-1 block">
                    {driver.podiums}
                  </span>
                </div>
                <div className="f1-glass-panel p-4 text-center">
                  <span className="text-[10px] font-mono-tech uppercase tracking-widest text-sky-300 block">
                    Pole Positions
                  </span>
                  <span className="text-3xl font-display font-bold text-white mt-1 block">
                    {driver.poles}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Career Timeline, Achievements & Tatuus F4-T421 Car Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {driver.careerTimeline && (
              <div className="lg:col-span-5 f1-glass-panel p-6 space-y-4">
                <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#E10600]" />
                  <span>Junior Formula &amp; F1 Academy Progression</span>
                </h3>
                <div className="space-y-3">
                  {driver.careerTimeline.map((item) => (
                    <div key={item.year} className="f1-glass-overlay rounded-xl p-4">
                      <div className="text-xs font-mono-tech font-bold uppercase" style={{ color: driver.teamColor }}>
                        {item.year} • {item.series}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-200 mt-1 leading-relaxed">{item.milestone}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {driver.achievements && (
              <div className="lg:col-span-3 f1-glass-panel p-6 space-y-4">
                <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Career Honours</span>
                </h3>
                <ul className="space-y-3">
                  {driver.achievements.map((ach) => (
                    <li key={ach} className="f1-glass-overlay rounded-xl p-3.5 flex items-start gap-2.5 text-xs sm:text-sm text-gray-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {driver.carMedia && (
              <div className="lg:col-span-4 f1-glass-panel p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[10px] font-mono-tech uppercase tracking-widest text-[#E10600] block">
                    Official F1 Academy Single-Seater Machinery
                  </span>
                  <h3 className="text-xl font-display font-bold text-white">
                    Tatuus F4-T421 — {driver.f1SupportedBy.split('(')[0].trim()} Livery
                  </h3>
                  <VerifiedMediaImage
                    media={driver.carMedia}
                    alt={`${driver.name} — Tatuus F4-T421`}
                    accentColor={driver.teamColor}
                    badgeText="Tatuus F4-T421 • 174 bhp Autotecnica Turbo"
                    fallbackType="car"
                    objectPosition="center center"
                    containerClassName="h-52 w-full rounded-xl"
                  />
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {driver.carMedia.caption}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center text-[11px] font-mono-tech">
                  <div className="f1-glass-overlay p-2 rounded-lg">
                    <span className="text-gray-400 block text-[9px]">CHASSIS</span>
                    <span className="text-white font-bold">Tatuus T421</span>
                  </div>
                  <div className="f1-glass-overlay p-2 rounded-lg">
                    <span className="text-gray-400 block text-[9px]">ENGINE</span>
                    <span className="text-white font-bold">1.4L Turbo</span>
                  </div>
                  <div className="f1-glass-overlay p-2 rounded-lg">
                    <span className="text-gray-400 block text-[9px]">TYRES</span>
                    <span className="text-white font-bold">Pirelli 13&quot;</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

