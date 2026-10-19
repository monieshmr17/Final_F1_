import React, { useState, useEffect } from 'react';
import {
  Wind,
  Zap,
  Cpu,
  Gauge,
  Flame,
  Eye,
  Play,
  Pause,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Layers,
  Camera,
} from 'lucide-react';
import { CAR_COMPONENTS_2026, CarComponentSpec } from '../data/f1MediaAndProfiles';
import { VerifiedMediaImage, resolveWikimediaCdnUrl } from './VerifiedMediaImage';

interface AnimatedF1CarExplorerProps {
  selectedComponentId: string;
  onSelectComponent: (id: string) => void;
  onAskGemini?: (prompt: string) => void;
}

interface RealF1CarPreset {
  id: string;
  teamName: string;
  chassis: string;
  powerUnit: string;
  accentColor: string;
  imageUrl: string;
  caption: string;
  author: string;
  license: string;
  sourceUrl: string;
  hotspots: Record<string, { xPct: number; yPct: number }>;
}

const REAL_F1_CAR_PRESETS: RealF1CarPreset[] = [
  {
    id: 'ferrari-sf26',
    teamName: 'Scuderia Ferrari HP',
    chassis: 'Ferrari SF-26',
    powerUnit: 'Ferrari 067/6 2026 Hybrid (50/50 ICE + 350kW MGU-K)',
    accentColor: '#E8002D',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Carlos_Sainz_Chinese_GP_2024.jpg',
    caption: 'Scuderia Ferrari Formula 1 single-seater side-quarter profile showing front wing elements, 18-inch Pirelli slick tyres, titanium Halo, sculpted sidepod undercut, and rear wing assembly',
    author: 'Elenav2009 / Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Carlos_Sainz_Chinese_GP_2024.jpg',
    hotspots: {
      'front-wing': { xPct: 78, yPct: 73 },
      'nose-cone': { xPct: 71, yPct: 64 },
      'suspension': { xPct: 63, yPct: 62 },
      'tires-rims': { xPct: 64, yPct: 73 },
      'brakes': { xPct: 67, yPct: 69 },
      'halo-cockpit': { xPct: 53, yPct: 48 },
      'floor-venturi': { xPct: 48, yPct: 71 },
      'sidepods': { xPct: 45, yPct: 57 },
      'power-unit': { xPct: 35, yPct: 51 },
      'ers-system': { xPct: 41, yPct: 60 },
      'rear-wing': { xPct: 19, yPct: 37 },
      'rear-diffuser': { xPct: 22, yPct: 58 },
    },
  },
  {
    id: 'mclaren-mcl40',
    teamName: 'McLaren Mastercard F1 Team',
    chassis: 'McLaren MCL40',
    powerUnit: 'Mercedes-AMG F1 M17 E Performance (350kW MGU-K)',
    accentColor: '#FF8000',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/55/2024-08-24_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3262_by_Stepro.jpg',
    caption: 'McLaren Formula 1 challenger at speed in Zandvoort showcasing papaya carbon-fibre aero surfaces, front wing endplates, low-drag engine cover, and diffuser wake control',
    author: 'Stepro / Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2024-08-24_Motorsport,_Formel_1,_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3262_by_Stepro.jpg',
    hotspots: {
      'front-wing': { xPct: 78, yPct: 70 },
      'nose-cone': { xPct: 71, yPct: 62 },
      'suspension': { xPct: 64, yPct: 60 },
      'tires-rims': { xPct: 65, yPct: 71 },
      'brakes': { xPct: 68, yPct: 66 },
      'halo-cockpit': { xPct: 53, yPct: 48 },
      'floor-venturi': { xPct: 48, yPct: 69 },
      'sidepods': { xPct: 45, yPct: 57 },
      'power-unit': { xPct: 35, yPct: 52 },
      'ers-system': { xPct: 42, yPct: 60 },
      'rear-wing': { xPct: 19, yPct: 41 },
      'rear-diffuser': { xPct: 23, yPct: 58 },
    },
  },
  {
    id: 'redbull-rb22',
    teamName: 'Oracle Red Bull Racing',
    chassis: 'Red Bull RB22',
    powerUnit: 'Red Bull Ford Powertrains DM01 (350kW MGU-K)',
    accentColor: '#3671C6',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/79/2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3978_by_Stepro.jpg',
    caption: 'Oracle Red Bull Racing single-seater demonstrating high-efficiency downwash sidepods, 3D sculpted Venturi floor edge, and pull-rod front suspension geometry',
    author: 'Stepro / Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2024-08-25_Motorsport,_Formel_1,_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3978_by_Stepro.jpg',
    hotspots: {
      'front-wing': { xPct: 76, yPct: 71 },
      'nose-cone': { xPct: 70, yPct: 63 },
      'suspension': { xPct: 63, yPct: 61 },
      'tires-rims': { xPct: 63, yPct: 71 },
      'brakes': { xPct: 66, yPct: 67 },
      'halo-cockpit': { xPct: 52, yPct: 48 },
      'floor-venturi': { xPct: 48, yPct: 69 },
      'sidepods': { xPct: 45, yPct: 57 },
      'power-unit': { xPct: 35, yPct: 52 },
      'ers-system': { xPct: 41, yPct: 59 },
      'rear-wing': { xPct: 20, yPct: 40 },
      'rear-diffuser': { xPct: 24, yPct: 58 },
    },
  },
  {
    id: 'mercedes-w17',
    teamName: 'Mercedes-AMG PETRONAS F1 Team',
    chassis: 'Mercedes-AMG F1 W17',
    powerUnit: 'Mercedes-AMG F1 M17 E Performance (350kW MGU-K)',
    accentColor: '#27F4D2',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/86/2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3988_by_Stepro.jpg',
    caption: 'Mercedes-AMG PETRONAS Formula 1 car showcasing silver-and-obsidian carbon bodywork, push-rod suspension kinematics, and PETRONAS Primax 100% sustainable fuel architecture',
    author: 'Stepro / Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2024-08-25_Motorsport,_Formel_1,_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3988_by_Stepro.jpg',
    hotspots: {
      'front-wing': { xPct: 76, yPct: 70 },
      'nose-cone': { xPct: 70, yPct: 62 },
      'suspension': { xPct: 64, yPct: 60 },
      'tires-rims': { xPct: 64, yPct: 70 },
      'brakes': { xPct: 67, yPct: 66 },
      'halo-cockpit': { xPct: 52, yPct: 48 },
      'floor-venturi': { xPct: 48, yPct: 69 },
      'sidepods': { xPct: 45, yPct: 57 },
      'power-unit': { xPct: 35, yPct: 53 },
      'ers-system': { xPct: 41, yPct: 59 },
      'rear-wing': { xPct: 19, yPct: 40 },
      'rear-diffuser': { xPct: 23, yPct: 58 },
    },
  },
];

// Coordinates for each of the 12 components in Side Wind-Tunnel view (viewBox 0 0 900 380)
const SIDE_HOTSPOTS: Record<string, { x: number; y: number; zoneLabel: string }> = {
  'front-wing': { x: 118, y: 266, zoneLabel: 'Active 3-Element Front Wing' },
  'nose-cone': { x: 182, y: 238, zoneLabel: 'Carbon Crash Nose Cone' },
  'suspension': { x: 255, y: 224, zoneLabel: 'Pushrod / Pullrod Suspension' },
  'tires-rims': { x: 222, y: 268, zoneLabel: '18" Pirelli P Zero & Rim' },
  'brakes': { x: 222, y: 235, zoneLabel: 'Brembo Carbon Disc & Duct' },
  'halo-cockpit': { x: 428, y: 162, zoneLabel: 'Titanium Grade-5 Halo & Cockpit' },
  'floor-venturi': { x: 470, y: 282, zoneLabel: 'Underbody Venturi Ground-Effect Tunnel' },
  'sidepods': { x: 485, y: 224, zoneLabel: 'Downwash Sidepod & Cooling Louvres' },
  'power-unit': { x: 590, y: 196, zoneLabel: '1.6L V6 Turbo ICE (100% Sustainable Fuel)' },
  'ers-system': { x: 530, y: 248, zoneLabel: '350 kW MGU-K & Lithium-Ion Energy Store' },
  'rear-wing': { x: 785, y: 148, zoneLabel: 'Active Dual-Mode Rear Wing (X/Z Mode)' },
  'rear-diffuser': { x: 778, y: 268, zoneLabel: 'Rear Diffuser Expansion Ramp' },
};

export const AnimatedF1CarExplorer: React.FC<AnimatedF1CarExplorerProps> = ({
  selectedComponentId,
  onSelectComponent,
  onAskGemini,
}) => {
  const [viewMode, setViewMode] = useState<'real-car' | 'wind-tunnel' | 'xray-top'>('real-car');
  const [selectedCarPresetId, setSelectedCarPresetId] = useState<string>('ferrari-sf26');
  const [aeroMode, setAeroMode] = useState<'Z-MODE' | 'X-MODE'>('Z-MODE');
  const [ersBoostActive, setErsBoostActive] = useState<boolean>(true);
  const [autoTourActive, setAutoTourActive] = useState<boolean>(false);
  const [showAirflow, setShowAirflow] = useState<boolean>(true);

  const activeComponent: CarComponentSpec =
    CAR_COMPONENTS_2026.find((c) => c.id === selectedComponentId) || CAR_COMPONENTS_2026[0];
  const activeCarPreset =
    REAL_F1_CAR_PRESETS.find((p) => p.id === selectedCarPresetId) || REAL_F1_CAR_PRESETS[0];

  // Optional auto-inspection tour cycling through the 12 components
  useEffect(() => {
    if (!autoTourActive) return;
    const timer = setInterval(() => {
      const idx = CAR_COMPONENTS_2026.findIndex((c) => c.id === selectedComponentId);
      const next = CAR_COMPONENTS_2026[(idx + 1) % CAR_COMPONENTS_2026.length];
      if (next) onSelectComponent(next.id);
    }, 3500);
    return () => clearInterval(timer);
  }, [autoTourActive, selectedComponentId, onSelectComponent]);

  const simulatedSpeed = aeroMode === 'X-MODE' ? (ersBoostActive ? 346 : 329) : ersBoostActive ? 268 : 252;
  const simulatedDownforce = aeroMode === 'Z-MODE' ? '24.8 kN (High Load)' : '11.2 kN (Low Drag)';
  const simulatedDrag = aeroMode === 'Z-MODE' ? '0.88 Cd' : '0.49 Cd (-44% Drag)';
  const simulatedErsPower = ersBoostActive ? '350 kW (470 bhp Max Override)' : '180 kW (Balanced Harvest)';

  return (
    <div className="space-y-6" data-testid="f1-tech-animated-explorer">
      {/* Top Interactive Wind-Tunnel Control Bar */}
      <div className="f1-glass-panel p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono-tech uppercase tracking-widest text-gray-400 mr-2 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#E10600]" /> Camera View:
          </span>
          <button
            type="button"
            onClick={() => setViewMode('real-car')}
            data-testid="tech-view-realcar"
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'real-car'
                ? 'bg-[#E10600] text-white shadow-lg shadow-[#E10600]/30'
                : 'f1-glass-pill text-gray-300 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Real Formula 1 Car Photo + Hotspots</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('wind-tunnel')}
            data-testid="tech-view-windtunnel"
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'wind-tunnel'
                ? 'bg-[#E10600] text-white shadow-lg shadow-[#E10600]/30'
                : 'f1-glass-pill text-gray-300 hover:text-white'
            }`}
          >
            Side CFD Wind-Tunnel CAD
          </button>
          <button
            type="button"
            onClick={() => setViewMode('xray-top')}
            data-testid="tech-view-xray"
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'xray-top'
                ? 'bg-[#E10600] text-white shadow-lg shadow-[#E10600]/30'
                : 'f1-glass-pill text-gray-300 hover:text-white'
            }`}
          >
            Top-Down Internal X-Ray Packaging
          </button>
        </div>

        {/* Live Active-Aero & Hybrid ERS Simulation Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setAeroMode((prev) => (prev === 'Z-MODE' ? 'X-MODE' : 'Z-MODE'))}
            data-testid="toggle-aero-mode"
            className={`px-3.5 py-2 rounded-lg text-xs font-mono-tech font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              aeroMode === 'X-MODE'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            {aeroMode === 'Z-MODE' ? 'Active Aero: Z-Mode (Cornering)' : 'Active Aero: X-Mode (Low-Drag Straight)'}
          </button>

          <button
            type="button"
            onClick={() => setErsBoostActive((prev) => !prev)}
            data-testid="toggle-ers-boost"
            className={`px-3.5 py-2 rounded-lg text-xs font-mono-tech font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              ersBoostActive
                ? 'bg-[#E10600]/20 text-red-300 border border-[#E10600]/50'
                : 'f1-glass-pill text-gray-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#E10600]" />
            {ersBoostActive ? '350 kW MGU-K Override: ON' : '350 kW MGU-K Override: OFF'}
          </button>

          <button
            type="button"
            onClick={() => setShowAirflow((prev) => !prev)}
            className={`px-3 py-2 rounded-lg text-xs font-mono-tech transition-all cursor-pointer ${
              showAirflow ? 'f1-glass-pill text-cyan-300 border-cyan-500/40' : 'f1-glass-pill text-gray-400'
            }`}
          >
            CFD Flow: {showAirflow ? 'Visible' : 'Hidden'}
          </button>

          <button
            type="button"
            onClick={() => setAutoTourActive((prev) => !prev)}
            data-testid="toggle-auto-tour"
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              autoTourActive
                ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50'
                : 'f1-glass-pill text-gray-300 hover:text-white'
            }`}
          >
            {autoTourActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {autoTourActive ? 'Pause Component Tour' : 'Auto-Inspect 12 Parts'}
          </button>
        </div>
      </div>

      {/* Main Split Grid: Animated Interactive Car Canvas (Left) + Selected Component Glass Dossier (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Columns: Live Animated 2026 F1 Car Visualization + 12 Component Selector Grid */}
        <div className="lg:col-span-7 f1-glass-panel p-5 sm:p-6 relative overflow-hidden">
          {/* Top Live Wind-Tunnel Telemetry Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
            <div className="f1-glass-overlay rounded-xl p-2.5 border border-white/10">
              <div className="text-[10px] font-mono-tech uppercase text-gray-400 flex items-center gap-1">
                <Gauge className="w-3 h-3 text-[#E10600]" /> Wind-Tunnel Speed
              </div>
              <div className="text-base font-bold font-mono-tech text-white mt-0.5">
                {simulatedSpeed} <span className="text-xs text-gray-400">km/h</span>
              </div>
            </div>
            <div className="f1-glass-overlay rounded-xl p-2.5 border border-white/10">
              <div className="text-[10px] font-mono-tech uppercase text-gray-400 flex items-center gap-1">
                <Wind className="w-3 h-3 text-sky-400" /> Downforce Load
              </div>
              <div className="text-sm font-bold font-mono-tech text-sky-300 mt-0.5">{simulatedDownforce}</div>
            </div>
            <div className="f1-glass-overlay rounded-xl p-2.5 border border-white/10">
              <div className="text-[10px] font-mono-tech uppercase text-gray-400 flex items-center gap-1">
                <Layers className="w-3 h-3 text-emerald-400" /> Aero Drag (Cd)
              </div>
              <div className="text-sm font-bold font-mono-tech text-emerald-300 mt-0.5">{simulatedDrag}</div>
            </div>
            <div className="f1-glass-overlay rounded-xl p-2.5 border border-white/10">
              <div className="text-[10px] font-mono-tech uppercase text-gray-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> MGU-K Output
              </div>
              <div className="text-xs font-bold font-mono-tech text-amber-300 mt-1 truncate">{simulatedErsPower}</div>
            </div>
          </div>

          {/* Constructor Car Switcher when in Real F1 Car Photo mode */}
          {viewMode === 'real-car' && (
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-[11px] font-mono-tech uppercase tracking-wider text-gray-300">
                Select Authentic Formula 1 Challenger Photograph:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {REAL_F1_CAR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedCarPresetId(preset.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono-tech font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      preset.id === selectedCarPresetId
                        ? 'bg-white/15 text-white border border-white/40 shadow'
                        : 'f1-glass-pill text-gray-300 hover:text-white'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: preset.accentColor }}
                    />
                    <span>{preset.chassis}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Animated Car Stage */}
          <div className="relative rounded-2xl bg-gradient-to-b from-[#070A10]/90 via-[#0B101B]/95 to-[#06080D]/95 border border-white/15 p-3 sm:p-5 overflow-hidden">
            {/* Ambient Stage Lighting */}
            <div
              className="pointer-events-none absolute -top-20 left-1/3 w-96 h-48 rounded-full blur-3xl opacity-30"
              style={{
                background:
                  aeroMode === 'X-MODE'
                    ? 'radial-gradient(circle, #10B981 0%, transparent 70%)'
                    : 'radial-gradient(circle, #E10600 0%, transparent 70%)',
              }}
            />

            {viewMode === 'real-car' ? (
              <div className="relative h-[340px] sm:h-[390px] w-full rounded-xl overflow-hidden select-none">
                <img
                  src={resolveWikimediaCdnUrl(activeCarPreset.imageUrl)}
                  alt={`${activeCarPreset.teamName} — ${activeCarPreset.chassis}`}
                  className="w-full h-full object-cover object-center transition-all duration-700"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(6,8,13,0.6) 0%, rgba(6,8,13,0.12) 38%, rgba(6,8,13,0.22) 68%, rgba(6,8,13,0.88) 100%)',
                  }}
                />

                {showAirflow && (
                  <svg
                    viewBox="0 0 1000 500"
                    className="absolute inset-0 w-full h-full pointer-events-none opacity-75"
                  >
                    <path
                      d="M 960 340 C 780 330, 640 245, 480 230 C 330 215, 200 185, 40 165"
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="2.5"
                      className="animate-aero-stream"
                    />
                    <path
                      d="M 940 375 C 760 368, 560 355, 360 340 C 210 328, 120 290, 30 265"
                      fill="none"
                      stroke="#27F4D2"
                      strokeWidth="2.5"
                      className="animate-aero-stream"
                    />
                  </svg>
                )}

                {/* Top Callout Banner */}
                <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                  <div className="f1-glass-overlay px-3.5 py-2 rounded-xl border border-white/20 flex items-center gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full animate-pulse"
                      style={{ backgroundColor: activeCarPreset.accentColor }}
                    />
                    <div>
                      <div className="text-[10px] font-mono-tech uppercase tracking-widest text-gray-300">
                        {activeCarPreset.teamName} • {activeCarPreset.chassis}
                      </div>
                      <div className="text-xs font-mono-tech font-bold text-white">
                        INSPECTING: {activeComponent.name.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-xl f1-glass-pill text-[11px] font-mono-tech font-bold text-white">
                    Click Any Hotspot (1–12)
                  </span>
                </div>

                {/* 12 Interactive Hotspots on Real Formula 1 Car Photograph */}
                {CAR_COMPONENTS_2026.map((comp, index) => {
                  const pos = activeCarPreset.hotspots[comp.id] || { xPct: 50, yPct: 50 };
                  const isSelected = comp.id === selectedComponentId;
                  return (
                    <button
                      key={comp.id}
                      type="button"
                      aria-label={`Inspect ${comp.name}`}
                      onClick={() => {
                        setAutoTourActive(false);
                        onSelectComponent(comp.id);
                      }}
                      style={{ left: `${pos.xPct}%`, top: `${pos.yPct}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all duration-300 ${
                        isSelected ? 'z-30 scale-125' : 'z-20 hover:scale-110'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute -inset-2.5 rounded-full bg-[#E10600]/45 animate-ping" />
                      )}
                      <span
                        className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full font-mono-tech text-xs font-bold flex items-center justify-center border-2 shadow-xl transition-all ${
                          isSelected
                            ? 'bg-[#E10600] text-white border-white shadow-[#E10600]/60'
                            : 'bg-[#07090D]/90 text-white border-[#27F4D2] hover:border-white'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span
                        className={`hidden sm:block absolute left-1/2 -translate-x-1/2 -top-8 whitespace-nowrap px-2 py-0.5 rounded-md text-[10px] font-mono-tech font-bold pointer-events-none transition-opacity ${
                          isSelected
                            ? 'opacity-100 bg-[#E10600] text-white shadow-lg'
                            : 'opacity-0 group-hover:opacity-100 bg-black/90 text-white border border-white/20'
                        }`}
                      >
                        {comp.svgRegionLabel}
                      </span>
                    </button>
                  );
                })}

                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-2 text-[11px] font-mono-tech">
                  <span className="px-2.5 py-1 rounded-lg f1-glass-pill text-gray-200 truncate">
                    {activeCarPreset.caption}
                  </span>
                  <a
                    href={activeCarPreset.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg f1-glass-pill text-gray-300 hover:text-white shrink-0"
                  >
                    {activeCarPreset.license}
                  </a>
                </div>
              </div>
            ) : viewMode === 'wind-tunnel' ? (
              <svg
                viewBox="0 0 900 360"
                className="w-full h-auto max-h-[340px] select-none"
                role="img"
                aria-label="Animated 2026 Formula 1 Car Wind-Tunnel Visualization with 12 Interactive Components"
              >
                <defs>
                  <linearGradient id="chassisBodyGrad" x1="0%" y1="0%" x2="100%" y2="20%">
                    <stop offset="0%" stopColor="#1B2234" />
                    <stop offset="45%" stopColor="#263048" />
                    <stop offset="78%" stopColor="#990804" />
                    <stop offset="100%" stopColor="#E10600" />
                  </linearGradient>
                  <linearGradient id="venturiGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(56, 189, 248, 0.05)" />
                    <stop offset="50%" stopColor="rgba(56, 189, 248, 0.45)" />
                    <stop offset="100%" stopColor="rgba(225, 6, 0, 0.55)" />
                  </linearGradient>
                  <radialGradient id="brakeGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.95" />
                    <stop offset="70%" stopColor="#E10600" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#E10600" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Rolling Wind-Tunnel Track Surface Belt */}
                <line x1="20" y1="312" x2="880" y2="312" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
                <line
                  x1="20"
                  y1="316"
                  x2="880"
                  y2="316"
                  stroke="#E10600"
                  strokeWidth="2"
                  className="animate-aero-stream"
                />

                {/* Animated CFD Airflow Streamlines */}
                {showAirflow && (
                  <g opacity="0.82">
                    {/* Upper canopy & rear-wing streamline */}
                    <path
                      d="M 15 245 Q 110 240, 175 210 Q 330 140, 445 130 Q 610 120, 775 125 L 885 110"
                      fill="none"
                      stroke={aeroMode === 'X-MODE' ? '#34D399' : '#38BDF8'}
                      strokeWidth="2.2"
                      className="animate-aero-stream"
                    />
                    {/* Mid-body sidepod downwash streamline */}
                    <path
                      d="M 15 268 Q 130 262, 245 215 Q 450 195, 640 225 Q 760 230, 885 190"
                      fill="none"
                      stroke="#60A5FA"
                      strokeWidth="1.8"
                      className="animate-aero-stream"
                    />
                    {/* Underfloor Venturi ground-effect suction & rear diffuser extraction */}
                    <path
                      d="M 30 292 L 290 292 Q 510 298, 725 288 Q 805 268, 885 232"
                      fill="none"
                      stroke="#F43F5E"
                      strokeWidth="2.5"
                      className="animate-aero-stream"
                    />
                  </g>
                )}

                {/* Animated Car Assembly (gentle suspension float) */}
                <g className="animate-car-float">
                  {/* Underbody Venturi Suction Field */}
                  <ellipse
                    cx="495"
                    cy="296"
                    rx="235"
                    ry="14"
                    fill="url(#venturiGlow)"
                    opacity={selectedComponentId === 'floor-venturi' ? 0.95 : 0.55}
                  />

                  {/* Rear Diffuser Expansion Ramp */}
                  <polygon
                    points="695,288 795,254 812,286 695,294"
                    fill={selectedComponentId === 'rear-diffuser' ? '#E10600' : '#1E2638'}
                    stroke="#F87171"
                    strokeWidth={selectedComponentId === 'rear-diffuser' ? '2.5' : '1.2'}
                  />

                  {/* Underbody Floor & Venturi Tunnel Plank */}
                  <path
                    d="M 245 284 L 725 284 L 740 294 L 235 294 Z"
                    fill={selectedComponentId === 'floor-venturi' ? '#0284C7' : '#121722'}
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth="1.5"
                  />

                  {/* Main Monocoque, Nose Cone, Engine Cover & Shark Fin */}
                  <path
                    d="M 118 265 L 205 226 L 365 204 L 420 165 L 495 162 L 560 134 L 750 155 L 742 258 L 685 282 L 250 282 L 130 274 Z"
                    fill="url(#chassisBodyGrad)"
                    stroke="rgba(255,255,255,0.42)"
                    strokeWidth="1.8"
                  />

                  {/* Sculpted Sidepod & Cooling Louvres */}
                  <path
                    d="M 355 222 Q 465 204, 635 245 L 650 278 L 350 278 Z"
                    fill={selectedComponentId === 'sidepods' ? 'rgba(225,6,0,0.65)' : 'rgba(15,19,29,0.88)'}
                    stroke={selectedComponentId === 'sidepods' ? '#FFFFFF' : '#E10600'}
                    strokeWidth="1.8"
                  />

                  {/* Titanium Grade-5 Halo Safety Structure */}
                  <path
                    d="M 355 204 Q 415 144, 482 166 M 418 158 L 442 198"
                    fill="none"
                    stroke={selectedComponentId === 'halo-cockpit' ? '#38BDF8' : '#E2E8F0'}
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  {/* Driver Helmet inside Cockpit */}
                  <circle cx="445" cy="182" r="14" fill="#E10600" stroke="#FFFFFF" strokeWidth="2" />
                  <path d="M 434 180 L 448 180" stroke="#27F4D2" strokeWidth="4" strokeLinecap="round" />

                  {/* Internal X-Ray Power Unit & 350 kW ERS Overlay */}
                  <g opacity={ersBoostActive || selectedComponentId === 'power-unit' || selectedComponentId === 'ers-system' ? 0.95 : 0.6}>
                    {/* Energy Store Battery Pack */}
                    <rect
                      x="475"
                      y="242"
                      width="76"
                      height="26"
                      rx="5"
                      fill="rgba(16, 185, 129, 0.28)"
                      stroke="#10B981"
                      strokeWidth="1.8"
                    />
                    {/* 1.6L V6 Turbo ICE */}
                    <rect
                      x="558"
                      y="184"
                      width="98"
                      height="52"
                      rx="6"
                      fill="rgba(225, 6, 0, 0.28)"
                      stroke="#F87171"
                      strokeWidth="1.8"
                    />
                    {/* Animated 350 kW MGU-K High-Voltage Energy Pulse */}
                    {ersBoostActive && (
                      <path
                        d="M 512 255 L 685 255"
                        fill="none"
                        stroke="#FACC15"
                        strokeWidth="3.5"
                        className="animate-energy-stream"
                      />
                    )}
                  </g>

                  {/* Active Front Wing (Flaps pivot between Z-Mode & X-Mode) */}
                  <g
                    transform={aeroMode === 'X-MODE' ? 'rotate(-5 118 268)' : 'rotate(0 118 268)'}
                    style={{ transition: 'transform 0.4s ease' }}
                  >
                    <path
                      d="M 68 278 L 156 262 L 162 288 L 64 292 Z"
                      fill={selectedComponentId === 'front-wing' ? '#E10600' : '#0F1420'}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                    <line x1="76" y1="274" x2="148" y2="266" stroke="#27F4D2" strokeWidth="2.5" />
                  </g>

                  {/* Active Rear Wing Assembly (Flaps open in X-Mode Low Drag) */}
                  <g>
                    {/* Rear Wing Endplate */}
                    <path
                      d="M 748 122 L 812 118 L 802 225 L 742 225 Z"
                      fill={selectedComponentId === 'rear-wing' ? 'rgba(225,6,0,0.55)' : '#121724'}
                      stroke="#FFFFFF"
                      strokeWidth="1.8"
                    />
                    {/* Movable Upper Flap */}
                    <line
                      x1="755"
                      y1={aeroMode === 'X-MODE' ? 136 : 148}
                      x2="806"
                      y2={aeroMode === 'X-MODE' ? 134 : 124}
                      stroke="#E10600"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  </g>

                  {/* Front & Rear Suspension Wishbones */}
                  <g
                    stroke={selectedComponentId === 'suspension' ? '#FACC15' : '#94A3B8'}
                    strokeWidth={selectedComponentId === 'suspension' ? '3.5' : '2.2'}
                  >
                    <line x1="222" y1="262" x2="278" y2="216" />
                    <line x1="222" y1="262" x2="282" y2="256" />
                    <line x1="698" y1="262" x2="642" y2="214" />
                  </g>

                  {/* FRONT 18-INCH PIRELLI WHEEL & SPINNING RIM + GLOWING BRAKE DISC */}
                  <g>
                    <circle cx="222" cy="264" r="46" fill="#0B0E14" stroke="#262E3D" strokeWidth="8" />
                    <circle
                      cx="222"
                      cy="264"
                      r="36"
                      fill="none"
                      stroke="#E10600"
                      strokeWidth="2.5"
                      strokeDasharray="18 8"
                      className="animate-wheel-spin"
                    />
                    <circle cx="222" cy="264" r="22" fill="url(#brakeGlow)" />
                    <g className="animate-wheel-spin">
                      <line x1="222" y1="234" x2="222" y2="294" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
                      <line x1="192" y1="264" x2="252" y2="264" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
                    </g>
                    <circle cx="222" cy="264" r="6" fill="#E10600" stroke="#FFFFFF" strokeWidth="1.5" />
                  </g>

                  {/* REAR 18-INCH PIRELLI WHEEL & SPINNING RIM + GLOWING BRAKE DISC */}
                  <g>
                    <circle cx="698" cy="264" r="48" fill="#0B0E14" stroke="#262E3D" strokeWidth="9" />
                    <circle
                      cx="698"
                      cy="264"
                      r="37"
                      fill="none"
                      stroke="#E10600"
                      strokeWidth="2.5"
                      strokeDasharray="18 8"
                      className="animate-wheel-spin"
                    />
                    <circle cx="698" cy="264" r="22" fill="url(#brakeGlow)" />
                    <g className="animate-wheel-spin">
                      <line x1="698" y1="232" x2="698" y2="296" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
                      <line x1="666" y1="264" x2="730" y2="264" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
                    </g>
                    <circle cx="698" cy="264" r="6" fill="#E10600" stroke="#FFFFFF" strokeWidth="1.5" />
                  </g>

                  {/* 12 Interactive Component Hotspots */}
                  {CAR_COMPONENTS_2026.map((comp, index) => {
                    const pos = SIDE_HOTSPOTS[comp.id] || { x: 400, y: 220, zoneLabel: comp.name };
                    const isSelected = comp.id === selectedComponentId;
                    return (
                      <g
                        key={comp.id}
                        onClick={() => {
                          setAutoTourActive(false);
                          onSelectComponent(comp.id);
                        }}
                        className="cursor-pointer"
                        role="button"
                        tabIndex={0}
                        aria-label={`Inspect ${comp.name}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setAutoTourActive(false);
                            onSelectComponent(comp.id);
                          }
                        }}
                      >
                        {isSelected && (
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r="20"
                            fill="rgba(225, 6, 0, 0.25)"
                            stroke="#E10600"
                            strokeWidth="2"
                          />
                        )}
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={isSelected ? 11 : 8}
                          fill={isSelected ? '#E10600' : '#0B0E17'}
                          stroke={isSelected ? '#FFFFFF' : '#27F4D2'}
                          strokeWidth="2"
                        />
                        <text
                          x={pos.x}
                          y={pos.y + 3.5}
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          {index + 1}
                        </text>
                      </g>
                    );
                  })}
                </g>

                {/* Active Component Callout Banner inside HUD */}
                <g transform="translate(24, 18)">
                  <rect
                    x="0"
                    y="0"
                    width="430"
                    height="36"
                    rx="8"
                    fill="rgba(12, 16, 26, 0.82)"
                    stroke="rgba(255, 255, 255, 0.18)"
                  />
                  <circle cx="18" cy="18" r="5" fill="#E10600" />
                  <text
                    x="32"
                    y="22"
                    fill="#F5F6F8"
                    fontSize="11.5"
                    fontWeight="bold"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    INSPECTING: {activeComponent.name.toUpperCase()}
                  </text>
                </g>
              </svg>
            ) : (
              /* Top-Down Internal X-Ray Blueprint View with Animated Airflow & Energy Vectors */
              <svg
                viewBox="0 0 500 680"
                className="w-full max-w-[390px] mx-auto h-auto max-h-[380px] select-none"
                role="img"
                aria-label="Top-Down X-Ray Formula 1 Car Packaging View"
              >
                {showAirflow && (
                  <g opacity="0.65">
                    <path
                      d="M 175 15 Q 155 220, 145 450 L 160 665"
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="2"
                      className="animate-aero-stream"
                    />
                    <path
                      d="M 325 15 Q 345 220, 355 450 L 340 665"
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="2"
                      className="animate-aero-stream"
                    />
                  </g>
                )}

                {/* Front Wing */}
                <path
                  d="M 90 48 L 410 48 L 395 86 L 105 86 Z"
                  fill={selectedComponentId === 'front-wing' ? 'rgba(225,6,0,0.48)' : '#171C28'}
                  stroke="#E10600"
                  strokeWidth="2"
                />
                {/* Front Wheels */}
                <rect x="46" y="128" width="54" height="106" rx="12" fill="#0B0D13" stroke="#94A3B8" strokeWidth="2" />
                <rect x="400" y="128" width="54" height="106" rx="12" fill="#0B0D13" stroke="#94A3B8" strokeWidth="2" />

                {/* Suspension Arms */}
                <line x1="100" y1="162" x2="214" y2="178" stroke="#27F4D2" strokeWidth="3" />
                <line x1="400" y1="162" x2="286" y2="178" stroke="#27F4D2" strokeWidth="3" />

                {/* Underbody Floor & Venturi Tunnels */}
                <path
                  d="M 140 245 L 360 245 L 372 515 L 128 515 Z"
                  fill={selectedComponentId === 'floor-venturi' ? 'rgba(56,189,248,0.28)' : '#111622'}
                  stroke="rgba(255,255,255,0.28)"
                  strokeWidth="2"
                />

                {/* Central Monocoque, Nose Cone & Engine Cover Spine */}
                <path
                  d="M 222 86 L 278 86 L 306 250 L 315 495 L 266 580 L 234 580 L 185 495 L 194 250 Z"
                  fill="#1C2232"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="2"
                />

                {/* Cockpit & Titanium Halo */}
                <ellipse
                  cx="250"
                  cy="298"
                  rx="32"
                  ry="52"
                  fill="#090C12"
                  stroke="#27F4D2"
                  strokeWidth="2.5"
                />

                {/* 2026 Power Unit & ERS Packaging */}
                <rect
                  x="216"
                  y="375"
                  width="68"
                  height="112"
                  rx="10"
                  fill="rgba(225,6,0,0.28)"
                  stroke="#E10600"
                  strokeWidth="2"
                />

                {/* Rear Wheels */}
                <rect x="38" y="476" width="66" height="118" rx="12" fill="#0B0D13" stroke="#94A3B8" strokeWidth="2" />
                <rect x="396" y="476" width="66" height="118" rx="12" fill="#0B0D13" stroke="#94A3B8" strokeWidth="2" />

                {/* Rear Wing & Diffuser */}
                <rect
                  x="130"
                  y="590"
                  width="240"
                  height="46"
                  rx="6"
                  fill={selectedComponentId === 'rear-wing' ? 'rgba(225,6,0,0.5)' : '#171C28'}
                  stroke="#E10600"
                  strokeWidth="2"
                />

                {/* Hotspots */}
                {CAR_COMPONENTS_2026.map((comp, idx) => {
                  const isSelected = comp.id === selectedComponentId;
                  return (
                    <g
                      key={comp.id}
                      onClick={() => {
                        setAutoTourActive(false);
                        onSelectComponent(comp.id);
                      }}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={comp.hotspot.cx}
                        cy={comp.hotspot.cy}
                        r={isSelected ? 15 : 10}
                        fill={isSelected ? '#E10600' : '#0B0E17'}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />
                      <text
                        x={comp.hotspot.cx}
                        y={comp.hotspot.cy + 4}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="9.5"
                        fontWeight="bold"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {idx + 1}
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}
          </div>

          {/* 12 Selectable Component Buttons Grid */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-mono-tech uppercase tracking-widest text-gray-400">
                Select Any of the 12 Formula 1 Car Systems to Inspect:
              </span>
              <span className="text-[11px] font-mono-tech text-[#27F4D2]">
                {CAR_COMPONENTS_2026.findIndex((c) => c.id === selectedComponentId) + 1} / {CAR_COMPONENTS_2026.length} Active
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CAR_COMPONENTS_2026.map((comp, idx) => {
                const isSelected = comp.id === selectedComponentId;
                return (
                  <button
                    key={comp.id}
                    type="button"
                    data-testid={`car-part-btn-${comp.id}`}
                    onClick={() => {
                      setAutoTourActive(false);
                      onSelectComponent(comp.id);
                    }}
                    className={`p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-[#E10600]/22 border border-[#E10600] text-white shadow-lg shadow-[#E10600]/20'
                        : 'f1-glass-overlay hover:border-white/30 text-gray-300'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg font-mono-tech text-xs font-bold flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#E10600] text-white' : 'bg-white/10 text-gray-300'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{comp.svgRegionLabel}</div>
                      <div className="text-[10px] text-gray-400 truncate">{comp.category}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Selected Component Glassmorphism Engineering Dossier */}
        <div className="lg:col-span-5 f1-glass-panel overflow-hidden" data-testid="car-component-detail-panel">
          <VerifiedMediaImage
            media={activeComponent.media}
            alt={activeComponent.name}
            badgeText={activeComponent.category}
            containerClassName="h-52 w-full"
          />

          <div className="p-6 space-y-5">
            <div>
              <div className="text-[11px] font-mono-tech uppercase tracking-widest text-[#E10600]">
                {activeComponent.locationOnCar}
              </div>
              <h3 className="text-2xl font-display font-bold text-white mt-1">{activeComponent.name}</h3>
            </div>

            <div className="space-y-3">
              <div className="f1-glass-overlay rounded-xl p-4">
                <div className="text-[10px] font-mono-tech uppercase tracking-widest text-[#27F4D2] mb-1">
                  Beginner Overview • What It Does
                </div>
                <p className="text-sm text-gray-200 leading-relaxed">{activeComponent.whatItDoes}</p>
              </div>

              <div className="f1-glass-overlay rounded-xl p-4">
                <div className="text-[10px] font-mono-tech uppercase tracking-widest text-amber-400 mb-1">
                  Engineering Principles • How It Works
                </div>
                <p className="text-sm text-gray-200 leading-relaxed">{activeComponent.howItWorks}</p>
              </div>

              <div className="f1-glass-overlay rounded-xl p-4">
                <div className="text-[10px] font-mono-tech uppercase tracking-widest text-[#E10600] mb-1">
                  Lap-Time Relevance • Why It Matters
                </div>
                <p className="text-sm text-gray-200 leading-relaxed">{activeComponent.whyItMatters}</p>
              </div>
            </div>

            {/* Key Engineering Metrics */}
            <div className="grid grid-cols-3 gap-2.5">
              {activeComponent.keyMetrics.map((m) => (
                <div key={m.label} className="f1-glass-overlay rounded-xl p-3">
                  <div className="text-[10px] text-gray-400 uppercase font-mono-tech">{m.label}</div>
                  <div className="text-xs font-bold font-mono-tech text-white mt-1">{m.value}</div>
                </div>
              ))}
            </div>

            {/* 4 Performance Impact Dimensions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-white/10">
              <div className="f1-glass-overlay rounded-xl p-3">
                <div className="text-[10px] font-mono-tech uppercase text-sky-400">Straight-Line Speed</div>
                <p className="text-xs text-gray-300 mt-1">{activeComponent.performanceImpact.speed}</p>
              </div>
              <div className="f1-glass-overlay rounded-xl p-3">
                <div className="text-[10px] font-mono-tech uppercase text-emerald-400">Mechanical & Aero Grip</div>
                <p className="text-xs text-gray-300 mt-1">{activeComponent.performanceImpact.grip}</p>
              </div>
              <div className="f1-glass-overlay rounded-xl p-3">
                <div className="text-[10px] font-mono-tech uppercase text-amber-400">Thermal & Energy Efficiency</div>
                <p className="text-xs text-gray-300 mt-1">{activeComponent.performanceImpact.efficiency}</p>
              </div>
              <div className="f1-glass-overlay rounded-xl p-3">
                <div className="text-[10px] font-mono-tech uppercase text-purple-400">Cornering Balance</div>
                <p className="text-xs text-gray-300 mt-1">{activeComponent.performanceImpact.handling}</p>
              </div>
            </div>

            {/* Advanced Deep-Dive & Ask Gemini Race Engineer */}
            <div className="f1-glass-overlay rounded-xl p-4 border border-[#E10600]/30">
              <div className="text-[10px] font-mono-tech uppercase tracking-widest text-[#E10600] mb-1">
                2026 FIA Technical Regulations Deep Dive
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{activeComponent.deepDiveLearnMore}</p>
              {onAskGemini && (
                <button
                  type="button"
                  onClick={() =>
                    onAskGemini(
                      `Explain the engineering physics of the 2026 Formula 1 ${activeComponent.name} and how teams optimize it for lap time.`
                    )
                  }
                  className="mt-3 w-full py-2.5 px-4 rounded-lg bg-[#E10600]/20 hover:bg-[#E10600] text-white border border-[#E10600]/50 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Ask Race Engineer About {activeComponent.svgRegionLabel}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
