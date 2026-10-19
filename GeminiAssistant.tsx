import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { DRIVERS_DATA, TEAMS_2026 } from '../utils/f1StatsEngine';
import { CAR_COMPONENTS_2026, CIRCUIT_EXTENDED_PROFILES } from '../data/f1MediaAndProfiles';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  sourceMode?: 'live-gemini-api' | 'knowledge-engine';
}

function generateLocalTelemetryAnswer(query: string): string {
  const q = query.toLowerCase();

  const matchedDriver = DRIVERS_DATA.find(
    (d) =>
      q.includes(d.lastName.toLowerCase()) ||
      q.includes(d.firstName.toLowerCase()) ||
      q.includes(d.id)
  );
  if (matchedDriver) {
    const s26 = matchedDriver.seasons[2026];
    const team = TEAMS_2026.find((t) => t.id === matchedDriver.currentTeamId);
    return `${matchedDriver.fullName} (#${matchedDriver.number}, ${team?.name}) — 2026 Season: P${s26?.position} with ${s26?.points} points (${s26?.gpPoints} GP pts + ${s26?.sprintPoints} Sprint pts), ${s26?.gpWins} GP wins, ${s26?.gpPodiums} GP podiums, and ${s26?.gpPoles} poles. Lifetime Career Totals: ${matchedDriver.career.points} career points, ${matchedDriver.career.gpWins} wins, ${matchedDriver.career.gpPodiums} podiums, ${matchedDriver.career.gpPoles} poles across ${matchedDriver.career.gpEntries} Grand Prix entries (${matchedDriver.career.worldChampionships} World Championships).`;
  }

  const matchedTeam = TEAMS_2026.find(
    (t) => q.includes(t.id) || q.includes(t.name.toLowerCase())
  );
  if (matchedTeam) {
    return `${matchedTeam.name} (${matchedTeam.chassis2026} • ${matchedTeam.powerUnit}) stands P${matchedTeam.season2026Position} in the 2026 Constructors' Championship with ${matchedTeam.season2026Points} points, ${matchedTeam.season2026Wins} wins, and ${matchedTeam.season2026Podiums} podiums. All-Time Heritage: ${matchedTeam.worldChampionships} World Constructors' Titles and ${matchedTeam.careerWins} Grand Prix victories. Team Principal: ${matchedTeam.principal}.`;
  }

  if (
    q.includes('tech') ||
    q.includes('wing') ||
    q.includes('x-mode') ||
    q.includes('z-mode') ||
    q.includes('mgu-k') ||
    q.includes('engine') ||
    q.includes('override') ||
    q.includes('diffuser') ||
    q.includes('ers') ||
    q.includes('nose') ||
    q.includes('2026 car')
  ) {
    const comp = CAR_COMPONENTS_2026.find(
      (c) =>
        q.includes(c.svgRegionLabel.toLowerCase()) || q.includes(c.id.replace('-', ' '))
    );
    if (comp) {
      return `${comp.name}: ${comp.whatItDoes} How it works: ${comp.howItWorks} Impact: ${comp.performanceImpact.speed}; ${comp.performanceImpact.efficiency}.`;
    }
    return `The 2026 FIA Technical Regulations feature 12 interactive systems including a 50/50 hybrid power unit (350 kW MGU-K electrical output + ~400 kW V6 ICE on 100% sustainable fuel), synchronized Active Aerodynamics switching between Z-Mode (high cornering downforce) and X-Mode (-40% straight-line drag), Manual Override Mode (MOM), and a 30kg lighter chassis.`;
  }

  if (
    q.includes('monza') ||
    q.includes('spa') ||
    q.includes('silverstone') ||
    q.includes('monaco') ||
    q.includes('suzuka') ||
    q.includes('cota') ||
    q.includes('circuit')
  ) {
    const cKey = Object.keys(CIRCUIT_EXTENDED_PROFILES).find((k) => q.includes(k)) || 'monza';
    const c = CIRCUIT_EXTENDED_PROFILES[cKey];
    return `Circuit Telemetry (${cKey.toUpperCase()}): Official Race Lap Record: ${c.raceLapRecord.time} by ${c.raceLapRecord.driver} (${c.raceLapRecord.year}). All-Time Qualifying Record: ${c.qualifyingRecord.time} by ${c.qualifyingRecord.driver} (${c.qualifyingRecord.year}). 2026 Event Fastest Lap: ${c.current2026FastestLap.time} by ${c.current2026FastestLap.driver}. Verified Average Race Lap: ${c.averageLapTime.time}.`;
  }

  if (q.includes('academy')) {
    return `F1 Academy is Formula 1's all-female single-seater championship designed to develop and propel female talent into higher categories (FRECA, F3, F2, and F1). Leading contenders include Doriane Pin (Mercedes-AMG / Prema), Maya Weug (Scuderia Ferrari / Prema), Alisha Palmowski (Red Bull / Campos), and Ella Lloyd (McLaren / Rodin).`;
  }

  return `2026 Championship Snapshot: Kimi Antonelli (Mercedes-AMG #12) leads the Drivers' Championship with 325 points (8 GP wins, 13 podiums, 6 poles; 470 career points), followed by Sir Lewis Hamilton (Scuderia Ferrari HP #44, 280 points; 7x World Champion, 108 career wins) and Max Verstappen (Oracle Red Bull Racing #1, 275 points; 4x World Champion, 74 career wins). Ask me about any driver, constructor, circuit lap record, or 2026 car component!`;
}

export const GeminiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [apiStatus, setApiStatus] = useState<{
    configured: boolean;
    mode: string;
  }>({ configured: false, mode: 'checking' });
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-msg',
      role: 'model',
      text: 'Welcome to the ULTIMATE F1 HUB Race Engineer Desk. Ask me about any 2026 driver (e.g., Kimi Antonelli, Lewis Hamilton, Max Verstappen), constructor governance, circuit lap records, F1 Academy, or the 12 interactive 2026 car components.',
      timestamp: '22:00 UTC',
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/gemini/status')
      .then((r) => r.json())
      .then((data) => {
        setApiStatus({
          configured: Boolean(data.configured),
          mode: data.mode || 'local-telemetry-knowledge-engine',
        });
      })
      .catch(() => {
        setApiStatus({ configured: false, mode: 'local-telemetry-knowledge-engine' });
      });
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const sendPrompt = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      const data = await res.json();

      const replyText =
        data.reply && typeof data.reply === 'string' && data.reply.trim().length > 0
          ? data.reply
          : generateLocalTelemetryAnswer(trimmed);

      const modelMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        role: 'model',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceMode: data.mode === 'live-gemini-api' ? 'live-gemini-api' : 'knowledge-engine',
      };
      setMessages((prev) => [...prev, modelMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        role: 'model',
        text: generateLocalTelemetryAnswer(trimmed),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceMode: 'knowledge-engine',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Kimi Antonelli 2026 vs Career stats',
    'Lewis Hamilton Ferrari & 7 titles',
    'How do 2026 X-Mode & Z-Mode wings work?',
    'Monza Race vs Qualifying lap records',
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Gemini F1 Race Engineer Assistant"
          data-testid="gemini-assistant-toggle"
          className="f1-glass-panel px-4 py-3 rounded-full border border-[#E10600]/60 hover:bg-[#E10600]/80 text-white shadow-2xl flex items-center gap-2.5 transition-all group"
        >
          <Sparkles className="w-4 h-4 text-[#E10600] group-hover:text-white" />
          <span className="font-heading text-sm font-bold">Gemini Race Engineer</span>
        </button>
      ) : (
        <div
          className="f1-glass-panel w-[355px] sm:w-[420px] h-[520px] flex flex-col border border-white/25 shadow-2xl overflow-hidden rounded-2xl"
          role="dialog"
          aria-label="Gemini Race Engineer Assistant"
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-[#E10600]/30 via-white/[0.04] to-transparent border-b border-white/15 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-[#E10600] flex items-center justify-center shadow-lg shadow-[#E10600]/30">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-base font-heading text-white leading-tight">
                  Gemini F1 Race Engineer
                </h3>
                <span className="text-[10px] text-gray-300 flex items-center gap-1">
                  {apiStatus.configured ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Server-Side Gemini API Connected</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 text-amber-400" />
                      <span>Verified F1 Telemetry Engine Active</span>
                    </>
                  )}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Minimize Gemini Race Engineer Assistant"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-[#E10600] text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-xl px-3.5 py-2.5 leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#E10600] text-white shadow-lg shadow-[#E10600]/20'
                      : 'f1-glass-inset text-gray-100'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">
                  {m.role === 'user' ? 'You' : 'Race Engineer'} • {m.timestamp}
                </span>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-gray-300 p-2">
                <RefreshCw className="w-3.5 h-3.5 text-[#E10600] animate-spin" />
                <span>Analyzing FIA telemetry &amp; historical archive...</span>
              </div>
            )}
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 border-t border-white/15 flex gap-1.5 overflow-x-auto bg-white/[0.02]">
            {quickPrompts.map((qp) => (
              <button
                key={qp}
                type="button"
                onClick={() => sendPrompt(qp)}
                className="f1-glass-pill px-2.5 py-1 rounded-full hover:bg-white/15 text-[11px] text-gray-200 whitespace-nowrap shrink-0 transition-colors"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendPrompt(input);
            }}
            className="p-3 border-t border-white/15 flex items-center gap-2 bg-black/40 backdrop-blur-md"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about drivers, teams, circuits, tech..."
              aria-label="Ask Gemini Race Engineer"
              className="flex-1 f1-glass-control rounded-lg px-3 py-2 text-xs text-white focus:border-[#E10600] outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message to Race Engineer"
              className="p-2 rounded-lg bg-[#E10600] hover:bg-red-700 disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
