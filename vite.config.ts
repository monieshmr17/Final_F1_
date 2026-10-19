import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const F1_SYSTEM_INSTRUCTION = `You are the ULTIMATE F1 HUB Race Engineer & Motorsport Historian Assistant.
You have authoritative knowledge of the 2026 FIA Formula One World Championship and F1 history (1950–2026):
- 2026 Drivers' Championship Leader: Kimi Antonelli (Mercedes-AMG PETRONAS #12) with 325 Season Points (303 GP points + 22 Sprint points), 8 GP Wins, 13 GP Podiums, 6 Pole Positions; Career Totals: 470 Career Points, 8 Career Wins, 16 Career Podiums, 6 Career Poles, 40 Career GP Entries, 0 World Championships.
- 2026 P2: Sir Lewis Hamilton (Scuderia Ferrari HP #44) with 280 Season Points, 3 GP Wins, 11 GP Podiums, 4 Poles in 2026; Career Totals: 7 World Championships (2008, 2014, 2015, 2017, 2018, 2019, 2020), 108 Career Wins, 213 Career Podiums, 108 Career Poles, 5145.5 Career Points, 398 Entries.
- 2026 P3: Max Verstappen (Oracle Red Bull Racing #1) with 275 Season Points, 7 GP Wins, 10 GP Podiums, 7 Poles in 2026; Career Totals: 4 World Championships (2021–2024), 74 Career Wins, 132 Career Podiums, 51 Poles, 3684.5 Career Points.
- 2026 P4: Charles Leclerc (Scuderia Ferrari HP #16, 260 pts, 3 wins), P5: George Russell (Mercedes #63, 248 pts, 3 wins), P6: Lando Norris (McLaren #4, 242 pts, 2 wins, 2025 World Champion), P7: Oscar Piastri (McLaren #81, 226 pts, 1 win), P8: Fernando Alonso (Aston Martin #14, 112 pts, 2x WDC), P9: Carlos Sainz (Williams #55, 94 pts), P10: Isack Hadjar (Red Bull #6, 92 pts).
- 11 Constructors in 2026: Mercedes-AMG PETRONAS (573 pts, P1), Scuderia Ferrari HP (540 pts, P2), McLaren (468 pts, P3), Oracle Red Bull Racing (367 pts, P4), Aston Martin Aramco (168 pts, P5), Atlassian Williams Racing (142 pts, P6), Audi F1 Team (86 pts, P7, Hülkenberg/Bortoleto), BWT Alpine (74 pts, P8, Gasly/Colapinto), Cadillac F1 Team (58 pts, P9, Pérez/Bottas), Visa Cash App Racing Bulls (49 pts, P10, Lawson/Lindblad), MoneyGram Haas F1 Team (41 pts, P11, Ocon/Bearman).
- 2026 Technical Regulations: 50/50 Hybrid Power Unit (350 kW MGU-K + 400 kW ICE on 100% sustainable fuel, MGU-H removed), Active Aerodynamics with Z-Mode (high downforce in corners) and X-Mode (low drag on straights), Manual Override Mode (MOM) within 1.0s, and nimble chassis (30kg lighter, 3400mm wheelbase).
- Always distinguish Career Statistics from Selected-Season Statistics and Sprint Statistics. Keep answers concise, editorial, and technically accurate.`;

function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-api-server-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/gemini')) {
          return next();
        }

        res.setHeader('Content-Type', 'application/json');

        if (req.url === '/api/gemini/status' && req.method === 'GET') {
          const apiKey = process.env.GEMINI_API_KEY;
          const configured = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 5);
          res.statusCode = 200;
          res.end(
            JSON.stringify({
              configured,
              model: 'gemini-3.8-flash',
              mode: configured ? 'live-gemini-api' : 'local-telemetry-knowledge-engine',
            })
          );
          return;
        }

        if (req.url === '/api/gemini/chat' && req.method === 'POST') {
          let rawBody = '';
          req.on('data', (chunk) => {
            rawBody += chunk;
          });
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(rawBody || '{}');
              const userMessage = String(parsed.message || '').trim();
              const history: Array<{ role: 'user' | 'model'; text: string }> = Array.isArray(parsed.history)
                ? parsed.history
                : [];

              if (!userMessage) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Message is required.' }));
                return;
              }

              const apiKey = process.env.GEMINI_API_KEY;
              const hasValidKey = Boolean(
                apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 5
              );

              if (!hasValidKey) {
                res.statusCode = 200;
                res.end(
                  JSON.stringify({
                    reply: null,
                    mode: 'knowledge-engine',
                    notice: 'Server GEMINI_API_KEY is not configured; using verified F1 Hub Knowledge Engine.',
                  })
                );
                return;
              }

              const ai = new GoogleGenAI({
                apiKey,
                httpOptions: {
                  headers: {
                    'User-Agent': 'aistudio-build',
                  },
                },
              });

              const contents = [
                ...history.slice(-8).map((h) => ({
                  role: h.role === 'model' ? 'model' : 'user',
                  parts: [{ text: String(h.text || '') }],
                })),
                {
                  role: 'user',
                  parts: [{ text: userMessage }],
                },
              ];

              const response = await ai.models.generateContent({
                model: 'gemini-3.8-flash',
                contents,
                config: {
                  systemInstruction: F1_SYSTEM_INSTRUCTION,
                  temperature: 0.4,
                },
              });

              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  reply: response.text || 'Telemetry response received with empty body.',
                  mode: 'live-gemini-api',
                })
              );
            } catch (err: unknown) {
              const message = err instanceof Error ? err.message : 'Unknown Gemini server error';
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  reply: null,
                  mode: 'knowledge-engine',
                  error: message,
                })
              );
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
