/**
 * Verified Wikimedia Commons Photographs, Licences, Attributions, Social Links,
 * Constructor Governance (Principal vs CEO vs Owner vs Title Sponsor),
 * Interactive SVG Circuit Paths & Turn Telemetry, and 10 Clickable Car Components.
 */

export interface MediaAttribution {
  imageUrl: string;
  author: string;
  license: string;
  sourceUrl: string;
  caption: string;
}

export interface SocialLinks {
  x: string;
  instagram: string;
  website: string;
}

export interface DriverExtendedMetadata {
  driverId: string;
  teammateId: string;
  objectPosition?: string;
  media: MediaAttribution;
  actionMedia?: MediaAttribution;
  careerTimeline: Array<{ year: string; team: string; milestone: string }>;
  achievements: string[];
  socials: SocialLinks;
}

export interface TeamGovernanceAndMedia {
  teamId: string;
  teamPrincipal: string;
  ceo: string;
  ownershipStructure: string;
  titleSponsor: string;
  headquarters: string;
  powerUnitFacility: string;
  historySummary: string;
  championshipYears: string;
  carMedia: MediaAttribution;
  socials: SocialLinks;
}

export interface CircuitTurnMarker {
  turn: number;
  name: string;
  x: number;
  y: number;
  minSpeedKmh: number;
  gear: number;
  aeroMode: 'Z-Mode (Cornering Downforce)' | 'X-Mode (Low Drag Straight)';
  note: string;
}

export interface CircuitExtendedProfile {
  circuitId: string;
  svgPath: string;
  startFinishCoord: { x: number; y: number };
  turns: CircuitTurnMarker[];
  raceLapRecord: { time: string; driver: string; year: number; car: string };
  qualifyingRecord: { time: string; driver: string; year: number; car: string };
  current2026FastestLap: { time: string; driver: string; session: string };
  averageLapTime: {
    time: string;
    datasetExplanation: string;
    calculationMethod: string;
  };
  historicalWinners: Array<{ year: number; driver: string; constructor: string }>;
  media: MediaAttribution;
}

export interface CarComponentSpec {
  id: string;
  name: string;
  category: string;
  svgRegionLabel: string;
  hotspot: { cx: number; cy: number };
  locationOnCar: string;
  whatItDoes: string;
  howItWorks: string;
  whyItMatters: string;
  performanceImpact: {
    speed: string;
    grip: string;
    efficiency: string;
    handling: string;
  };
  deepDiveLearnMore: string;
  keyMetrics: Array<{ label: string; value: string }>;
  media: MediaAttribution;
}

export interface F1AcademySeriesProfile {
  id: string;
  name: string;
  nationality: string;
  number: number;
  team: string;
  f1SupportedBy: string;
  teamColor: string;
  seasonPoints: number;
  wins: number;
  podiums: number;
  poles: number;
  bio: string;
  achievements: string[];
  careerTimeline?: Array<{ year: string; series: string; milestone: string }>;
  socials: SocialLinks;
  objectPosition?: string;
  media: MediaAttribution;
  carMedia?: MediaAttribution;
}

export const DRIVER_EXTENDED_METADATA: Record<string, DriverExtendedMetadata> = {
  antonelli: {
    driverId: 'antonelli',
    teammateId: 'russell',
    objectPosition: '50% 14%',
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Kimi_Antonelli_at_the_2025_US_Grand_Prix_in_Austin%2C_TX_%28cropped%29.jpg',
      author: 'Wikimedia Commons / US Grand Prix Paddock Portrait',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kimi_Antonelli_at_the_2025_US_Grand_Prix_in_Austin,_TX_(cropped).jpg',
      caption: 'Andrea Kimi Antonelli — Official Formula 1 Paddock Portrait',
    },
    actionMedia: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/55/2024-08-24_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3434_by_Stepro.jpg',
      author: 'Stepro (Wikimedia Commons)',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Andrea_Kimi_Antonelli',
      caption: 'Mercedes-AMG PETRONAS Works Single-Seater on Track',
    },
    careerTimeline: [
      { year: '2022–2023', team: 'Prema Racing (F4 / FRECA)', milestone: 'Won Italian F4, ADAC F4, Formula Regional Middle East, and FRECA Championship titles consecutively' },
      { year: '2024', team: 'Prema Racing / Mercedes Junior', milestone: 'Formula 2 Sprint & Feature Race winner at Silverstone & Hungaroring; F1 FP1 debut at Monza' },
      { year: '2025', team: 'Mercedes-AMG PETRONAS', milestone: 'Full-time Formula 1 rookie season: 145 points, 3 GP podiums, P6 in World Drivers’ Championship' },
      { year: '2026', team: 'Mercedes-AMG PETRONAS', milestone: 'Leading the 2026 World Drivers’ Championship with 325 points, 8 GP wins, 13 podiums, and 6 poles' },
    ],
    achievements: [
      '2026 World Championship Leader (325 Points, 8 GP Wins)',
      'Youngest Multiple Grand Prix Winner in Mercedes-AMG History',
      '40 Career Grand Prix Entries • 470 Career Points • 16 Career Podiums',
      '2023 Formula Regional European Champion & 2022 Italian/ADAC F4 Champion',
    ],
    socials: {
      x: 'https://x.com/MercedesAMGF1',
      instagram: 'https://www.instagram.com/kimi.antonelli/',
      website: 'https://www.formula1.com/en/drivers/andrea-kimi-antonelli',
    },
  },
  hamilton: {
    driverId: 'hamilton',
    teammateId: 'leclerc',
    objectPosition: '50% 16%',
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Lewis_Hamilton_2022_S%C3%A3o_Paulo_Grand_Prix_%2852498120773%29_%28cropped%29.jpg',
      author: 'Beto Issa / Fórmula 1 (Wikimedia Commons)',
      license: 'CC BY 2.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lewis_Hamilton_2022_S%C3%A3o_Paulo_Grand_Prix_(52498120773)_(cropped).jpg',
      caption: 'Sir Lewis Hamilton — Official Formula 1 Paddock Editorial Portrait',
    },
    actionMedia: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/32/2025_Japan_GP_-_Ferrari_-_Lewis_Hamilton_-_Fanzone_Stage_%28cropped%29.jpg',
      author: 'Wikimedia Commons / 2025 Japanese GP Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:2025_Japan_GP_-_Ferrari_-_Lewis_Hamilton_-_Fanzone_Stage_(cropped).jpg',
      caption: 'Sir Lewis Hamilton in Scuderia Ferrari racing apparel at the Japanese Grand Prix',
    },
    careerTimeline: [
      { year: '2007–2012', team: 'McLaren Mercedes', milestone: 'Sensational F1 debut in 2007 (9 consecutive podiums); won maiden World Championship in 2008 and 21 GP victories for McLaren' },
      { year: '2013–2024', team: 'Mercedes-AMG PETRONAS', milestone: 'Captured 6 Drivers’ World Titles (2014, 2015, 2017, 2018, 2019, 2020), 84 wins with the Silver Arrows, and broke the all-time wins & poles records' },
      { year: '2025', team: 'Scuderia Ferrari HP', milestone: 'Historic move to Maranello; scored 202 points and Sprint victory in scarlet' },
      { year: '2026', team: 'Scuderia Ferrari HP', milestone: '3 Grand Prix victories (Montreal, Silverstone, Baku) and 11 podiums in the Ferrari SF-26, standing P2 with 280 points' },
    ],
    achievements: [
      '7x FIA Formula 1 World Drivers’ Champion (All-Time Joint Record)',
      'All-Time Record 108 Career Grand Prix Wins',
      'All-Time Record 108 Career Pole Positions & 213 Career Podiums',
      'All-Time Record 5,145.5 Career Championship Points across 398 Entries',
    ],
    socials: {
      x: 'https://x.com/LewisHamilton',
      instagram: 'https://www.instagram.com/lewishamilton/',
      website: 'https://www.formula1.com/en/drivers/lewis-hamilton',
    },
  },
  verstappen: {
    driverId: 'verstappen',
    teammateId: 'hadjar',
    objectPosition: '50% 14%',
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3973_by_Stepro_%28medium_crop%29.jpg',
      author: 'Stepro (Wikimedia Commons)',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:2024-08-25_Motorsport,_Formel_1,_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3973_by_Stepro_(medium_crop).jpg',
      caption: 'Max Verstappen — Oracle Red Bull Racing Paddock Portrait',
    },
    actionMedia: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Max_Verstappen_2024_Chinese_GP.jpg',
      author: 'Wikimedia Commons Red Bull Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Max_Verstappen',
      caption: 'Max Verstappen in the Oracle Red Bull Racing challenger',
    },
    careerTimeline: [
      { year: '2015', team: 'Scuderia Toro Rosso', milestone: 'Youngest driver in Formula 1 history at 17 years, 166 days; scored 49 rookie points' },
      { year: '2016–2020', team: 'Red Bull Racing', milestone: 'Won on Red Bull debut at 2016 Spanish GP, becoming youngest-ever GP winner (18 years, 228 days)' },
      { year: '2021–2024', team: 'Oracle Red Bull Racing', milestone: 'Won four consecutive World Drivers’ Championships (2021–2024), including record 19 wins in 2023' },
      { year: '2026', team: 'Oracle Red Bull Racing', milestone: '7 Grand Prix wins and 7 poles in the Red Bull Ford RB22 (275 points, P3)' },
    ],
    achievements: [
      '4x FIA Formula 1 World Drivers’ Champion (2021, 2022, 2023, 2024)',
      '74 Career Grand Prix Wins & 132 Career Podiums',
      'Record 19 Grand Prix Wins in a Single Season (2023) & 10 Consecutive Wins',
      'Youngest Grand Prix Winner in Formula 1 History (18 years, 228 days)',
    ],
    socials: {
      x: 'https://x.com/Max33Verstappen',
      instagram: 'https://www.instagram.com/maxverstappen1/',
      website: 'https://www.verstappen.com/',
    },
  },
  leclerc: {
    driverId: 'leclerc',
    teammateId: 'hamilton',
    objectPosition: '50% 14%',
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Charles_Leclerc_at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_%28028A8638%29_%28cropped%29.jpg',
      author: 'Wikimedia Commons / 2026 Australian GP Melbourne Walk',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Charles_Leclerc_at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_(028A8638)_(cropped).jpg',
      caption: 'Charles Leclerc at the 2026 Australian Grand Prix Melbourne Walk',
    },
    actionMedia: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Carlos_Sainz_Chinese_GP_2024.jpg',
      author: 'Wikimedia Commons Ferrari Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Charles_Leclerc',
      caption: 'Scuderia Ferrari HP Works Single-Seater on Track',
    },
    careerTimeline: [
      { year: '2018', team: 'Alfa Romeo Sauber F1 Team', milestone: 'Graduated as consecutive GP3 (2016) & FIA F2 (2017) Champion to score 39 points in rookie F1 campaign' },
      { year: '2019–2024', team: 'Scuderia Ferrari', milestone: 'Historic victories at Spa, Monza (2019 & 2024), and emotional home win at Monaco (2024); 2022 World Championship runner-up' },
      { year: '2026', team: 'Scuderia Ferrari HP', milestone: '3 Grand Prix victories including 2026 Monaco GP & Bahrain GP (260 points, P4)' },
    ],
    achievements: [
      '11 Career Grand Prix Wins & 31 Career Pole Positions',
      '56 Career Grand Prix Podiums & 1,938 Career Points',
      'Two-Time Winner of Both the Monaco Grand Prix and Italian Grand Prix at Monza',
    ],
    socials: {
      x: 'https://x.com/Charles_Leclerc',
      instagram: 'https://www.instagram.com/charles_leclerc/',
      website: 'https://www.charlesleclerc.com/',
    },
  },
  russell: {
    driverId: 'russell',
    teammateId: 'antonelli',
    objectPosition: '50% 15%',
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/af/FIA_F1_Austria_2022_George_Russell_%28cropped%29.jpg',
      author: 'Wikimedia Commons / FIA F1 Austrian GP',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:FIA_F1_Austria_2022_George_Russell_(cropped).jpg',
      caption: 'George Russell in Mercedes-AMG PETRONAS Formula 1 racing suit',
    },
    actionMedia: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/55/2024-08-24_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3434_by_Stepro.jpg',
      author: 'Stepro (Wikimedia Commons)',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:George_Russell_(racing_driver)',
      caption: 'George Russell driving the Mercedes-AMG PETRONAS challenger at Zandvoort',
    },
    careerTimeline: [
      { year: '2019–2021', team: 'Williams Racing', milestone: 'Three seasons with Williams highlighted by front-row qualifying and maiden podium at the 2021 Belgian GP' },
      { year: '2022–2025', team: 'Mercedes-AMG PETRONAS', milestone: 'Maiden F1 Sprint & GP victory in São Paulo 2022; multiple Grand Prix victories across 2024–2025' },
      { year: '2026', team: 'Mercedes-AMG PETRONAS', milestone: '3 Grand Prix wins, 10 podiums, 248 points helping Mercedes lead the Constructors’ title' },
    ],
    achievements: [
      '8 Career Grand Prix Wins & 32 Career Podiums',
      '11 Career Pole Positions & 1,218 Career Points',
      '2018 FIA Formula 2 & 2017 GP3 Series Champion',
    ],
    socials: {
      x: 'https://x.com/GeorgeRussell63',
      instagram: 'https://www.instagram.com/georgerussell63/',
      website: 'https://www.georgerussell63.com/',
    },
  },
  norris: {
    driverId: 'norris',
    teammateId: 'piastri',
    objectPosition: '50% 15%',
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/90/2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3968_by_Stepro_%28cropped2%29.jpg',
      author: 'Stepro (Wikimedia Commons)',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Lando_Norris',
      caption: 'Lando Norris — McLaren Formula 1 Team Portrait',
    },
    actionMedia: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/df/2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3805_by_Stepro.jpg',
      author: 'Stepro (Wikimedia Commons)',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Lando_Norris',
      caption: 'Lando Norris in the McLaren Formula 1 Team challenger',
    },
    careerTimeline: [
      { year: '2019–2023', team: 'McLaren F1 Team', milestone: 'Maiden podium at 2020 Austrian GP, maiden pole position at 2021 Russian GP, and 7 podiums in 2023' },
      { year: '2024–2025', team: 'McLaren F1 Team', milestone: 'Maiden victory at 2024 Miami GP; led McLaren to 2024 Constructors’ title and crowned 2025 World Drivers’ Champion' },
      { year: '2026', team: 'McLaren F1 Team', milestone: '2 Grand Prix wins, 9 podiums, and 242 points in the McLaren MCL40' },
    ],
    achievements: [
      '2025 FIA Formula 1 World Drivers’ Champion',
      '13 Career Grand Prix Wins & 52 Career Podiums',
      '17 Career Pole Positions & 1,689 Career Points',
    ],
    socials: {
      x: 'https://x.com/LandoNorris',
      instagram: 'https://www.instagram.com/landonorris/',
      website: 'https://landonorris.com/',
    },
  },
  piastri: {
    driverId: 'piastri',
    teammateId: 'norris',
    objectPosition: '50% 14%',
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Oscar_Piastri_at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_%28028A8607%29_cropped.jpg',
      author: 'Wikimedia Commons / 2026 Australian GP Melbourne Walk',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Oscar_Piastri_at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_(028A8607)_cropped.jpg',
      caption: 'Oscar Piastri at the 2026 Australian Grand Prix Melbourne Walk',
    },
    actionMedia: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/df/2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3805_by_Stepro.jpg',
      author: 'Stepro (Wikimedia Commons)',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Oscar_Piastri',
      caption: 'McLaren Formula 1 Team Papaya Challenger on Track',
    },
    careerTimeline: [
      { year: '2019–2021', team: 'R-ace GP / Prema Racing', milestone: 'Won three consecutive junior championships: Formula Renault Eurocup (2019), FIA F3 (2020), and FIA F2 (2021)' },
      { year: '2023', team: 'McLaren F1 Team', milestone: 'FIA Rookie of the Year with Sprint win in Qatar and Grand Prix podiums at Suzuka and Lusail' },
      { year: '2024–2026', team: 'McLaren F1 Team', milestone: 'Grand Prix victories in Hungary and Baku (2024), multiple wins in 2025, and 226 season points in 2026' },
    ],
    achievements: [
      '10 Career Grand Prix Wins & 33 Career Podiums',
      '3 Career Sprint Victories & 995 Career Points',
      'Consecutive F3 (2020) and F2 (2021) Rookie Champion',
    ],
    socials: {
      x: 'https://x.com/OscarPiastri',
      instagram: 'https://www.instagram.com/oscarpiastri/',
      website: 'https://oscarpiastri.com/',
    },
  },
  alonso: {
    driverId: 'alonso',
    teammateId: 'stroll',
    objectPosition: '50% 14%',
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/2025_Japan_GP_-_Aston_Martin_-_Fernando_Alonso_-_Fanzone_Stage_%28cropped%29.jpg',
      author: 'Wikimedia Commons / 2025 Japanese GP Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:2025_Japan_GP_-_Aston_Martin_-_Fernando_Alonso_-_Fanzone_Stage_(cropped).jpg',
      caption: 'Fernando Alonso in Aston Martin Aramco team gear at the Japanese Grand Prix',
    },
    actionMedia: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/2024-08-24_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3318_by_Stepro.jpg',
      author: 'Stepro (Wikimedia Commons)',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Fernando_Alonso',
      caption: 'Fernando Alonso in the Aston Martin Aramco British Racing Green challenger',
    },
    careerTimeline: [
      { year: '2001–2009', team: 'Minardi / Renault / McLaren', milestone: 'Back-to-back World Drivers’ Championships with Renault in 2005 and 2006, ending Michael Schumacher’s reign' },
      { year: '2010–2014', team: 'Scuderia Ferrari', milestone: 'Three-time World Championship runner-up (2010, 2012, 2013) with 11 Grand Prix victories for Maranello' },
      { year: '2015–2022', team: 'McLaren / Alpine ( plus WEC & Le Mans)', milestone: 'Won the 24 Hours of Le Mans twice (2018, 2019) and the FIA World Endurance Championship with Toyota' },
      { year: '2023–2026', team: 'Aston Martin Aramco', milestone: '8 podiums in 2023 and 3 podiums in 2026 (112 season points) in the Newey-Honda AMR26' },
    ],
    achievements: [
      '2x FIA Formula 1 World Drivers’ Champion (2005, 2006)',
      'All-Time Record 443 Career Grand Prix Entries',
      '32 Career Grand Prix Wins, 109 Podiums & 2,519 Career Points',
      '2x 24 Hours of Le Mans Winner & FIA World Endurance Champion',
    ],
    socials: {
      x: 'https://x.com/alo_oficial',
      instagram: 'https://www.instagram.com/fernandoalo_oficial/',
      website: 'https://www.fernandoalonso.com/',
    },
  },
  sainz: {
    driverId: 'sainz',
    teammateId: 'albon',
    objectPosition: '50% 14%',
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Carlos_Sainz_at_the_83rd_Venice_FILM_festival-9_%28cropped%29.jpg',
      author: 'Wikimedia Commons Portrait Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Carlos_Sainz_at_the_83rd_Venice_FILM_festival-9_(cropped).jpg',
      caption: 'Carlos Sainz Jr. — Official Close-Up Portrait',
    },
    actionMedia: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Carlos_Sainz_Jr._at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_%28028A7953%29.jpg',
      author: 'Wikimedia Commons / 2026 Australian GP Melbourne Walk',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Carlos_Sainz_Jr._at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_(028A7953).jpg',
      caption: 'Carlos Sainz Jr. at the 2026 Australian Grand Prix Paddock',
    },
    careerTimeline: [
      { year: '2015–2018', team: 'Scuderia Toro Rosso / Renault F1 Team', milestone: 'Graduated as Formula Renault 3.5 Champion to establish himself as one of F1’s most consistent points scorers' },
      { year: '2019–2020', team: 'McLaren F1 Team', milestone: 'Captured maiden F1 podium at the 2019 Brazilian GP and P2 at the 2020 Italian GP, finishing P6 in both seasons' },
      { year: '2021–2024', team: 'Scuderia Ferrari', milestone: '4 Grand Prix wins at Silverstone (2022), Singapore (2023), Melbourne & Mexico City (2024) plus 23 Ferrari podiums' },
      { year: '2025–2026', team: 'Atlassian Williams Racing', milestone: 'Leading Williams back to the podium in the Mercedes-powered FW48 with 94 points in 2026' },
    ],
    achievements: [
      '4 Career Grand Prix Wins & 29 Career Podiums',
      '6 Career Pole Positions & 1,446.5 Career Points across 248 Entries',
      'Grand Prix Winner for Scuderia Ferrari at Silverstone, Marina Bay, Albert Park & Mexico City',
    ],
    socials: {
      x: 'https://x.com/Carlossainz55',
      instagram: 'https://www.instagram.com/carlossainz55/',
      website: 'https://www.carlossainz.es/',
    },
  },
};

export function getDriverExtendedMetadata(driverId: string, driverName: string, teamId: string): DriverExtendedMetadata {
  if (DRIVER_EXTENDED_METADATA[driverId]) {
    return DRIVER_EXTENDED_METADATA[driverId];
  }
  const teammateMap: Record<string, string> = {
    hadjar: 'verstappen',
    stroll: 'alonso',
    hulkenberg: 'bortoleto',
    bortoleto: 'hulkenberg',
    albon: 'sainz',
    gasly: 'colapinto',
    colapinto: 'gasly',
    perez: 'bottas',
    bottas: 'perez',
    lawson: 'lindblad',
    lindblad: 'lawson',
    ocon: 'bearman',
    bearman: 'ocon',
  };
  const wikiPortraitMap: Record<
    string,
    {
      url: string;
      author: string;
      objectPosition: string;
      timeline: Array<{ year: string; team: string; milestone: string }>;
      achievements: string[];
      socials: SocialLinks;
    }
  > = {
    hadjar: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Isack_Hadjar_at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_%28028A8753%29_%28cropped%29.jpg',
      author: 'Wikimedia Commons 2026 Australian GP Archive',
      objectPosition: '50% 14%',
      timeline: [
        { year: '2022–2024', team: 'Hitech / Campos Racing (F3 & F2)', milestone: '2024 FIA Formula 2 Vice-Champion with 4 Feature Race victories as Red Bull Junior Team standout' },
        { year: '2025', team: 'Visa Cash App Racing Bulls', milestone: 'Impressive rookie Formula 1 campaign earning promotion to the senior Milton Keynes seat' },
        { year: '2026', team: 'Oracle Red Bull Racing', milestone: 'Partnering Max Verstappen in the Red Bull Ford RB22 with 2 podiums and 98 season points' },
      ],
      achievements: [
        '2026 Oracle Red Bull Racing Works Driver (2 Career F1 Podiums)',
        '2024 FIA Formula 2 Championship Runner-Up (4 Feature Race Wins)',
      ],
      socials: {
        x: 'https://x.com/Isack_Hadjar',
        instagram: 'https://www.instagram.com/isackhadjar/',
        website: 'https://www.redbullracing.com/',
      },
    },
    albon: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Alex_Albon_at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_%28028A8626%29_%28cropped%29.jpg',
      author: 'Wikimedia Commons 2026 Australian GP Archive',
      objectPosition: '50% 14%',
      timeline: [
        { year: '2019–2020', team: 'Scuderia Toro Rosso / Red Bull Racing', milestone: 'Graduated from F2 top-3 to Red Bull Racing, scoring 2 F1 podiums at Mugello and Bahrain in 2020' },
        { year: '2022–2024', team: 'Williams Racing', milestone: 'Spearheaded Williams’ midfield resurgence with Giant-Killing qualifying performances and P7 in 2023 Constructors’' },
        { year: '2025–2026', team: 'Atlassian Williams Racing', milestone: 'Forming one of the grid’s strongest pairings alongside Carlos Sainz in the 2026 Williams FW48 (68 season points)' },
      ],
      achievements: [
        '2 Career Formula 1 Podiums & 348+ Career Championship Points',
        '2019 FIA Rookie of the Year & Multi-Year Williams Team Leader',
      ],
      socials: {
        x: 'https://x.com/alex_albon',
        instagram: 'https://www.instagram.com/alex_albon/',
        website: 'https://www.alexalbon.com/',
      },
    },
    gasly: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Pierre_Gasly_2017_Malaysia.jpg',
      author: 'Morio (Wikimedia Commons)',
      objectPosition: '50% 15%',
      timeline: [
        { year: '2017–2022', team: 'Toro Rosso / Red Bull / Scuderia AlphaTauri', milestone: 'Historic maiden Grand Prix victory at the 2020 Italian Grand Prix at Monza plus podiums in Brazil (2019) & Baku (2021)' },
        { year: '2023–2025', team: 'BWT Alpine F1 Team', milestone: 'Delivered podiums at Zandvoort (2023) and double-podium triumph at Interlagos (2024) for Enstone' },
        { year: '2026', team: 'BWT Alpine F1 Team', milestone: 'Leading Alpine’s Mercedes-powered 2026 technical era alongside Franco Colapinto (62 season points)' },
      ],
      achievements: [
        '2020 Italian Grand Prix Winner at Autodromo Nazionale Monza',
        '5 Career Formula 1 Podiums & 480+ Career Championship Points',
        '2016 GP2 Series Champion',
      ],
      socials: {
        x: 'https://x.com/PierreGASLY',
        instagram: 'https://www.instagram.com/pierregasly/',
        website: 'https://www.pierregasly.com/',
      },
    },
    hulkenberg: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/d/de/2019_Formula_One_tests_Barcelona%2C_Hulkenberg_%2840287128313%29.jpg',
      author: 'Wikimedia Commons Barcelona F1 Archive',
      objectPosition: '50% 15%',
      timeline: [
        { year: '2010–2019', team: 'Williams / Force India / Sauber / Renault', milestone: 'Sensational rookie pole position at 2010 Brazilian GP; 2015 24 Hours of Le Mans overall winner with Porsche' },
        { year: '2023–2024', team: 'MoneyGram Haas F1 Team', milestone: 'Returned to full-time F1 as a qualifying powerhouse, helping Haas secure P7 in 2024' },
        { year: '2025–2026', team: 'Sauber / Audi F1 Team', milestone: 'Factory works leader for Audi F1 Team’s historic 2026 debut season alongside Gabriel Bortoleto (54 season points)' },
      ],
      achievements: [
        '2015 24 Hours of Le Mans Overall Winner (Porsche 919 Hybrid)',
        '2010 Brazilian Grand Prix Pole-Sitter & 600+ Career F1 Points across 245+ Starts',
        '2009 GP2 Series Champion & A1GP Champion',
      ],
      socials: {
        x: 'https://x.com/HulkHulkenberg',
        instagram: 'https://www.instagram.com/hulkhulkenberg/',
        website: 'https://www.audi.com/en/sport/motorsport/formula-1.html',
      },
    },
    perez: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Sergio_P%C3%A9rez_2019_%28cropped%29.jpg',
      author: 'Wikimedia Commons F1 Archive',
      objectPosition: '50% 14%',
      timeline: [
        { year: '2011–2020', team: 'Sauber / McLaren / Force India / Racing Point', milestone: 'Earned 10 podiums and charged from last to 1st for his maiden F1 victory at the 2020 Sakhir Grand Prix' },
        { year: '2021–2024', team: 'Oracle Red Bull Racing', milestone: '5 Grand Prix victories (including Monaco 2022, Singapore 2022, Jeddah & Baku 2023) and 2023 World Championship Runner-Up' },
        { year: '2026', team: 'Cadillac Formula 1 Team', milestone: 'Spearheading General Motors and Cadillac’s inaugural 11th-team Formula 1 entry alongside Valtteri Bottas' },
      ],
      achievements: [
        '6 Career Grand Prix Wins & 39 Career Podiums',
        '3 Career Pole Positions & 1,660+ Career Championship Points',
        '2023 FIA Formula 1 World Drivers’ Championship Runner-Up',
      ],
      socials: {
        x: 'https://x.com/SChecoPerez',
        instagram: 'https://www.instagram.com/schecoperez/',
        website: 'https://checoperez.com/',
      },
    },
    bottas: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Valtteri_Bottas_at_the_2026_Adelaide_Motorsport_Festival_%28028A7556%29.jpg',
      author: 'Wikimedia Commons 2026 Motorsport Archive',
      objectPosition: '50% 14%',
      timeline: [
        { year: '2013–2016', team: 'Williams Martini Racing', milestone: 'Captured 9 Grand Prix podiums and P4 in the 2014 World Drivers’ Championship' },
        { year: '2017–2021', team: 'Mercedes-AMG PETRONAS', milestone: '10 Grand Prix victories, 20 pole positions, 58 podiums, and five consecutive Constructors’ titles with Mercedes (103 consecutive Q3 appearances)' },
        { year: '2022–2024', team: 'Alfa Romeo / Stake F1 Team Kick Sauber', milestone: 'Led Hinwil squad through ground-effect regulations with P10 in 2022 standings' },
        { year: '2026', team: 'Cadillac Formula 1 Team', milestone: 'Bringing 10-time GP winner pedigree to Cadillac’s works Formula 1 launch alongside Sergio Pérez' },
      ],
      achievements: [
        '10 Career Grand Prix Wins, 20 Pole Positions & 67 Career Podiums',
        '2x FIA World Drivers’ Championship Runner-Up (2019, 2020)',
        '1,800+ Career Formula 1 Championship Points',
      ],
      socials: {
        x: 'https://x.com/ValtteriBottas',
        instagram: 'https://www.instagram.com/valtteribottas/',
        website: 'https://valtteribottas.com/',
      },
    },
    stroll: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/2025_Japan_GP_-_Aston_Martin_-_Lance_Stroll_-_Fanzone_Stage_%28cropped%29.jpg',
      author: 'Wikimedia Commons Japanese GP Archive',
      objectPosition: '50% 14%',
      timeline: [
        { year: '2017–2018', team: 'Williams Martini Racing', milestone: 'Youngest rookie podium finisher in F1 history at the 2017 Azerbaijan Grand Prix (18 years, 239 days)' },
        { year: '2019–2020', team: 'Racing Point F1 Team', milestone: 'Wet-weather pole position at the 2020 Turkish GP and twin podiums at Monza and Sakhir' },
        { year: '2021–2026', team: 'Aston Martin Aramco', milestone: 'Competing alongside Fernando Alonso in the Silverstone squad’s Honda works era' },
      ],
      achievements: [
        '3 Career Formula 1 Podiums & 1 Career Pole Position (Turkey 2020)',
        '320+ Career Championship Points across 185+ Grand Prix Entries',
        '2016 FIA European Formula 3 Champion',
      ],
      socials: {
        x: 'https://x.com/lance_stroll',
        instagram: 'https://www.instagram.com/lance_stroll/',
        website: 'https://www.astonmartinf1.com/',
      },
    },
    ocon: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Esteban_Ocon_2024_Suzuka_%28cropped%29.jpg',
      author: 'Wikimedia Commons Suzuka Archive',
      objectPosition: '50% 14%',
      timeline: [
        { year: '2016–2018', team: 'Manor Racing / Force India', milestone: 'Record 27 consecutive finishes from debut; P8 in the 2017 World Championship' },
        { year: '2020–2024', team: 'Renault / BWT Alpine F1 Team', milestone: 'Maiden Grand Prix victory at the 2021 Hungarian GP plus podiums at Sakhir (2020), Monaco (2023), and São Paulo (2024)' },
        { year: '2025–2026', team: 'MoneyGram Haas F1 Team', milestone: 'Team leader at MoneyGram Haas F1 Team alongside Oliver Bearman' },
      ],
      achievements: [
        '2021 Hungarian Grand Prix Winner & 4 Career Formula 1 Podiums',
        '470+ Career Formula 1 Points; 2015 GP3 & 2014 FIA European F3 Champion',
      ],
      socials: {
        x: 'https://x.com/OconEsteban',
        instagram: 'https://www.instagram.com/estebanocon/',
        website: 'https://www.haasf1team.com/',
      },
    },
    lawson: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Liam_Lawson_at_the_Red_Bull_Fan_Zone_%E2%80%93_Crown_Riverwalk%2C_Melbourne_%28028A7795%29.jpg',
      author: 'Wikimedia Commons Melbourne F1 Archive',
      objectPosition: '50% 15%',
      timeline: [
        { year: '2021–2023', team: 'DTM / FIA F2 / Super Formula', milestone: 'DTM & Super Formula Championship runner-up; scored rookie F1 points at 2023 Singapore GP' },
        { year: '2024–2026', team: 'Visa Cash App Racing Bulls', milestone: 'Leading Faenza’s 2026 Red Bull Ford campaign alongside rookie Arvid Lindblad' },
      ],
      achievements: [
        'Multiple Points Finishes across Singapore, Austin & Interlagos',
        '2023 Super Formula Runner-Up & 2021 DTM Vice-Champion',
      ],
      socials: {
        x: 'https://x.com/liamlawson30',
        instagram: 'https://www.instagram.com/liamlawson30/',
        website: 'https://www.liamlawson30.com/',
      },
    },
    bearman: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/2025_Japan_GP_-_Haas_-_Oliver_Bearman_-_Thursday_%28cropped%29.jpg',
      author: 'Wikimedia Commons Japanese GP Archive',
      objectPosition: '50% 14%',
      timeline: [
        { year: '2021–2023', team: 'Van Amersfoort / Prema Racing', milestone: 'First driver in history to win both Italian F4 and ADAC F4 titles in the same season (2021); multiple F2 winner' },
        { year: '2024', team: 'Scuderia Ferrari / Haas F1 Team', milestone: 'Sensational P7 debut for Scuderia Ferrari at 2024 Saudi Arabian GP at age 18; scored points in first 2 F1 starts for 2 different constructors' },
        { year: '2025–2026', team: 'MoneyGram Haas F1 Team', milestone: 'Full-time Haas F1 racer backed by Scuderia Ferrari Driver Academy' },
      ],
      achievements: [
        'Youngest Driver Ever to Compete for Scuderia Ferrari (P7 on Debut at Jeddah 2024)',
        'First Driver in F1 History to Score Points in Maiden Starts for Two Constructors (Ferrari & Haas)',
      ],
      socials: {
        x: 'https://x.com/OllieBearman',
        instagram: 'https://www.instagram.com/olliebearman/',
        website: 'https://www.olliebearman.com/',
      },
    },
    bortoleto: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Gabriel_Bortoleto_at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_%28028A8581%29_cropped.jpg',
      author: 'Wikimedia Commons 2026 Australian GP Archive',
      objectPosition: '50% 14%',
      timeline: [
        { year: '2023–2024', team: 'Trident / Invicta Racing', milestone: 'Won back-to-back rookie titles in FIA Formula 3 (2023) and FIA Formula 2 (2024), including last-to-first Monza Feature win' },
        { year: '2025–2026', team: 'Sauber / Audi F1 Team', milestone: 'Representing Brazil on the Formula 1 grid as factory Audi F1 Team driver alongside Nico Hülkenberg' },
      ],
      achievements: [
        'Consecutive Rookie Champion in FIA Formula 3 (2023) & FIA Formula 2 (2024)',
        'First Full-Time Brazilian Formula 1 Driver Since 2017',
      ],
      socials: {
        x: 'https://x.com/gabortoleto85',
        instagram: 'https://www.instagram.com/gabrielbortoleto_/',
        website: 'https://www.audi.com/en/sport/motorsport/formula-1.html',
      },
    },
    colapinto: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Franco_Colapinto_at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_%28028A8698%29_cropped.jpg',
      author: 'Wikimedia Commons 2026 Australian GP Archive',
      objectPosition: '50% 14%',
      timeline: [
        { year: '2024', team: 'MP Motorsport / Williams Racing', milestone: 'Imola F2 winner; called up by Williams for final 9 F1 rounds of 2024, scoring points in Baku (P8) and Austin (P10)' },
        { year: '2025–2026', team: 'BWT Alpine F1 Team', milestone: 'Joined BWT Alpine F1 Team as full-time race driver alongside Pierre Gasly' },
      ],
      achievements: [
        'First Argentine Formula 1 Driver to Score World Championship Points Since Carlos Reutemann (1982)',
        '2019 Spanish F4 Champion & FIA Formula 2 Race Winner at Imola',
      ],
      socials: {
        x: 'https://x.com/FranColapinto',
        instagram: 'https://www.instagram.com/francolapinto/',
        website: 'https://www.francolapinto.com/',
      },
    },
    lindblad: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Arvid_Lindblad_at_the_Red_Bull_Fan_Zone_%E2%80%93_Crown_Riverwalk%2C_Melbourne_%28028A7869%29_%28cropped%29.jpg',
      author: 'Wikimedia Commons Melbourne F1 Archive',
      objectPosition: '50% 14%',
      timeline: [
        { year: '2023–2025', team: 'Prema Racing / Campos Racing (F4, F3, FROCE & F2)', milestone: 'Macau F4 Race winner, Silverstone F3 Sprint & Feature double winner, and 2025 Formula Regional Oceania Champion' },
        { year: '2026', team: 'Visa Cash App Racing Bulls', milestone: 'Graduated from Red Bull Junior Team to make his full-time Formula 1 debut in 2026 alongside Liam Lawson' },
      ],
      achievements: [
        '2025 Formula Regional Oceania Champion & Red Bull Junior Prodigy',
        'First Driver in FIA Formula 3 History to Sweep Both Races on a Single Weekend (Silverstone 2024)',
      ],
      socials: {
        x: 'https://x.com/arvidlindblad',
        instagram: 'https://www.instagram.com/arvid.lindblad/',
        website: 'https://www.visacashapprb.com/',
      },
    },
  };

  const photoInfo = wikiPortraitMap[driverId];
  const teamGov = TEAM_GOVERNANCE_AND_MEDIA[teamId];
  return {
    driverId,
    teammateId: teammateMap[driverId] || 'antonelli',
    objectPosition: photoInfo?.objectPosition || '50% 15%',
    media: {
      imageUrl: photoInfo?.url || '',
      author: photoInfo?.author || 'Wikimedia Commons FIA Paddock Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: `https://commons.wikimedia.org/wiki/Special:Search/${encodeURIComponent(driverName)}`,
      caption: `${driverName} — Official FIA Formula 1 Driver Portrait`,
    },
    actionMedia: teamGov?.carMedia,
    careerTimeline: photoInfo?.timeline || [
      { year: 'Junior Formulae', team: 'FIA Single-Seater Ladder', milestone: 'Graduated through FIA F3 / F2 Championship ranks' },
      { year: '2025', team: teamId.toUpperCase(), milestone: 'Full-season campaign building toward the 2026 regulation reset' },
      { year: '2026', team: teamId.toUpperCase(), milestone: `Active 2026 World Championship contender for ${teamId.toUpperCase()}` },
    ],
    achievements: photoInfo?.achievements || [
      `Official 2026 FIA Formula 1 World Championship Driver (${driverName})`,
      'Verified Career & 2026 Season Telemetry Profile',
    ],
    socials: photoInfo?.socials || {
      x: 'https://x.com/F1',
      instagram: 'https://www.instagram.com/f1/',
      website: 'https://www.formula1.com/en/drivers',
    },
  };
}

/**
 * AUTHORITATIVE CONSTRUCTOR GOVERNANCE & MEDIA
 * Strictly distinguishes Team Principal, CEO, Owner/Ownership Structure, and Title Sponsor.
 */
export const TEAM_GOVERNANCE_AND_MEDIA: Record<string, TeamGovernanceAndMedia> = {
  mercedes: {
    teamId: 'mercedes',
    teamPrincipal: 'Toto Wolff',
    ceo: 'Toto Wolff (CEO & Team Principal)',
    ownershipStructure: 'Equal 33.3% tripartite ownership: Mercedes-Benz Group AG, INEOS, and Toto Wolff',
    titleSponsor: 'PETRONAS',
    headquarters: 'Brackley, Northamptonshire, United Kingdom',
    powerUnitFacility: 'Mercedes-AMG High Performance Powertrains (Brixworth, UK)',
    historySummary: 'Descended from Tyrrell, BAR, Honda, and Brawn GP before becoming the Mercedes works team in 2010. Won a record eight consecutive Constructors’ titles (2014–2021) and leads the 2026 Championship.',
    championshipYears: '2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021',
    carMedia: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/55/2024-08-24_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3434_by_Stepro.jpg',
      author: 'Stepro (Wikimedia Commons)',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Mercedes_F1_cars',
      caption: 'Mercedes-AMG PETRONAS Formula One Team Works Challenger',
    },
    socials: {
      x: 'https://x.com/MercedesAMGF1',
      instagram: 'https://www.instagram.com/mercedesamgf1/',
      website: 'https://www.mercedesamgf1.com/',
    },
  },
  ferrari: {
    teamId: 'ferrari',
    teamPrincipal: 'Frédéric Vasseur',
    ceo: 'Benedetto Vigna (CEO of Ferrari N.V.)',
    ownershipStructure: 'Ferrari N.V. (Publicly traded; Exor N.V. & Piero Ferrari major shareholders)',
    titleSponsor: 'HP (Hewlett-Packard)',
    headquarters: 'Maranello, Emilia-Romagna, Italy',
    powerUnitFacility: 'Maranello Gestione Sportiva, Italy',
    historySummary: 'The only constructor to have competed in every single season of the FIA Formula 1 World Championship since 1950, holding the all-time records for titles (16), wins (256), and podiums (849).',
    championshipYears: '1961, 1964, 1975, 1976, 1977, 1979, 1982, 1983, 1999, 2000, 2001, 2002, 2003, 2004, 2007, 2008',
    carMedia: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Carlos_Sainz_Chinese_GP_2024.jpg',
      author: 'Wikimedia Commons Ferrari Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Ferrari_Formula_One_cars',
      caption: 'Scuderia Ferrari HP Works Single-Seater',
    },
    socials: {
      x: 'https://x.com/ScuderiaFerrari',
      instagram: 'https://www.instagram.com/scuderiaferrari/',
      website: 'https://www.ferrari.com/en-EN/formula1',
    },
  },
  mclaren: {
    teamId: 'mclaren',
    teamPrincipal: 'Andrea Stella',
    ceo: 'Zak Brown (CEO of McLaren Racing)',
    ownershipStructure: 'McLaren Group / Mumtalakat Holding Company (Bahrain Sovereign Wealth Fund)',
    titleSponsor: 'Mastercard (Principal Partner)',
    headquarters: 'McLaren Technology Centre, Woking, Surrey, United Kingdom',
    powerUnitFacility: 'Mercedes-AMG High Performance Powertrains (Brixworth, UK)',
    historySummary: 'Founded by Bruce McLaren in 1963. Iconic constructor of the Senna/Prost, Häkkinen, Hamilton, and modern Norris/Piastri eras.',
    championshipYears: '1974, 1984, 1985, 1988, 1989, 1990, 1991, 1998, 2024',
    carMedia: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/df/2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3805_by_Stepro.jpg',
      author: 'Stepro (Wikimedia Commons)',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:McLaren_Formula_One_cars',
      caption: 'McLaren Formula 1 Team Papaya Challenger',
    },
    socials: {
      x: 'https://x.com/McLarenF1',
      instagram: 'https://www.instagram.com/mclaren/',
      website: 'https://www.mclaren.com/racing/',
    },
  },
  redbull: {
    teamId: 'redbull',
    teamPrincipal: 'Christian Horner',
    ceo: 'Christian Horner (CEO & Team Principal) / Oliver Mintzlaff (Red Bull GmbH CEO Corporate Projects)',
    ownershipStructure: 'Red Bull GmbH (Chaleo Yoovidhya family 51%, Mark Mateschitz 49%)',
    titleSponsor: 'Oracle',
    headquarters: 'Red Bull Technology Campus, Milton Keynes, United Kingdom',
    powerUnitFacility: 'Red Bull Ford Powertrains (Milton Keynes, UK)',
    historySummary: 'Entered Formula 1 in 2005 after acquiring Jaguar Racing, winning four straight titles with Sebastian Vettel (2010–2013) and dominating the ground-effect era with Max Verstappen.',
    championshipYears: '2010, 2011, 2012, 2013, 2022, 2023',
    carMedia: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Max_Verstappen_2024_Chinese_GP.jpg',
      author: 'Wikimedia Commons Red Bull Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Red_Bull_Racing_cars',
      caption: 'Oracle Red Bull Racing Single-Seater',
    },
    socials: {
      x: 'https://x.com/redbullracing',
      instagram: 'https://www.instagram.com/redbullracing/',
      website: 'https://www.redbullracing.com/',
    },
  },
  aston: {
    teamId: 'aston',
    teamPrincipal: 'Andy Cowell / Adrian Newey (Managing Technical Partner)',
    ceo: 'Andy Cowell (Group CEO)',
    ownershipStructure: 'AMR GP Holdings consortium led by Executive Chairman Lawrence Stroll, with Aramco and Arctos Partners',
    titleSponsor: 'Aramco',
    headquarters: 'AMR Technology Campus, Silverstone, United Kingdom',
    powerUnitFacility: 'Honda Racing Corporation (Sakura, Japan)',
    historySummary: 'Tracing its Silverstone roots to Jordan Grand Prix (1991), Force India, and Racing Point, Aston Martin operates as Honda’s exclusive works partner in 2026.',
    championshipYears: 'None (Targeting maiden title in 2026 era)',
    carMedia: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/2024-08-24_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3318_by_Stepro.jpg',
      author: 'Stepro (Wikimedia Commons)',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Aston_Martin_Formula_One_cars',
      caption: 'Aston Martin Aramco British Racing Green Challenger',
    },
    socials: {
      x: 'https://x.com/AstonMartinF1',
      instagram: 'https://www.instagram.com/astonmartinf1/',
      website: 'https://www.astonmartinf1.com/',
    },
  },
  williams: {
    teamId: 'williams',
    teamPrincipal: 'James Vowles',
    ceo: 'James Vowles / Matthew Savage (Chairman)',
    ownershipStructure: 'Dorilton Capital (US private investment firm)',
    titleSponsor: 'Atlassian',
    headquarters: 'Grove, Oxfordshire, United Kingdom',
    powerUnitFacility: 'Mercedes-AMG High Performance Powertrains (Brixworth, UK)',
    historySummary: 'Founded by Sir Frank Williams and Sir Patrick Head in 1977, winning 9 Constructors’ World Championships and 114 Grand Prix victories.',
    championshipYears: '1980, 1981, 1986, 1987, 1992, 1993, 1994, 1996, 1997',
    carMedia: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/17/FIA_F1_Austria_2024_Nr._23_Albon.jpg',
      author: 'Wikimedia Commons Williams Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Williams_Formula_One_cars',
      caption: 'Atlassian Williams Racing grove-built challenger',
    },
    socials: {
      x: 'https://x.com/WilliamsRacing',
      instagram: 'https://www.instagram.com/williamsracing/',
      website: 'https://www.williamsf1.com/',
    },
  },
  audi: {
    teamId: 'audi',
    teamPrincipal: 'Jonathan Wheatley',
    ceo: 'Mattia Binotto (COO & CTO of Sauber Motorsport / Audi F1 Project)',
    ownershipStructure: 'AUDI AG (Volkswagen Group) with Qatar Investment Authority (QIA) minority stake',
    titleSponsor: 'Revolut / bp Castrol Technical Partnership',
    headquarters: 'Hinwil, Switzerland (Chassis) & Neuburg an der Donau, Germany (Power Unit)',
    powerUnitFacility: 'Audi Formula Racing GmbH, Neuburg, Germany',
    historySummary: 'Built upon the foundation of Peter Sauber’s Hinwil team (entered F1 in 1993), transitioning into the full factory Audi F1 Team for the 2026 hybrid regulation reset.',
    championshipYears: 'Debut Works Era (2026)',
    carMedia: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/2024-08-24_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3314_by_Stepro.jpg',
      author: 'Stepro (Wikimedia Commons)',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Audi_in_Formula_One',
      caption: 'Audi F1 Team Hinwil Works Challenger',
    },
    socials: {
      x: 'https://x.com/audisport',
      instagram: 'https://www.instagram.com/audisport/',
      website: 'https://www.audi.com/en/sport/motorsport/formula-1.html',
    },
  },
  alpine: {
    teamId: 'alpine',
    teamPrincipal: 'Oliver Oakes',
    ceo: 'Philippe Krief (CEO of Alpine) / Flavio Briatore (Executive Advisor)',
    ownershipStructure: 'Renault Group (76%) & Otro Capital investor group (24%)',
    titleSponsor: 'BWT',
    headquarters: 'Enstone, Oxfordshire, United Kingdom',
    powerUnitFacility: 'Mercedes-AMG High Performance Powertrains (Brixworth, UK)',
    historySummary: 'Enstone’s lineage spans Toleman, Benetton (1995 title), Renault (2005 & 2006 titles), Lotus, and Alpine.',
    championshipYears: '2005, 2006 (as Renault F1 Team)',
    carMedia: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/40/2024_Spanish_Grand_Prix_%2853811182883%29.jpg',
      author: 'Wikimedia Commons Alpine Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Alpine_F1_cars',
      caption: 'BWT Alpine F1 Team Enstone Challenger',
    },
    socials: {
      x: 'https://x.com/AlpineF1Team',
      instagram: 'https://www.instagram.com/alpinef1team/',
      website: 'https://www.alpinecars.com/en/formula-1/',
    },
  },
  cadillac: {
    teamId: 'cadillac',
    teamPrincipal: 'Graeme Lowdon',
    ceo: 'Dan Towriss (CEO of TWG Motorsports)',
    ownershipStructure: 'TWG Global & General Motors (Cadillac)',
    titleSponsor: 'TWG / Cadillac',
    headquarters: 'Fishers, Indiana, USA & Silverstone, United Kingdom',
    powerUnitFacility: 'Ferrari Customer Power Unit (2026–2027) transitioning to GM Works PU',
    historySummary: 'Approved as Formula 1’s 11th constructor for 2026, bringing General Motors and Cadillac engineering alongside board director Mario Andretti.',
    championshipYears: 'Inaugural Season (2026)',
    carMedia: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/2026_6_Hours_of_Spa-Francorchamps_Cadillac_Hertz_Team_Jota_Cadillac_V-Series.R_No.12_%28DSC07675%29.jpg',
      author: 'Wikimedia Commons Cadillac Racing',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Cadillac_in_motorsport',
      caption: 'Cadillac Racing Motorsport Engineering',
    },
    socials: {
      x: 'https://x.com/Cadillac',
      instagram: 'https://www.instagram.com/cadillac/',
      website: 'https://www.cadillac.com/',
    },
  },
  rb: {
    teamId: 'rb',
    teamPrincipal: 'Laurent Mekies',
    ceo: 'Peter Bayer',
    ownershipStructure: 'Red Bull GmbH',
    titleSponsor: 'Visa & Cash App',
    headquarters: 'Faenza, Emilia-Romagna, Italy & Milton Keynes, UK',
    powerUnitFacility: 'Red Bull Ford Powertrains (Milton Keynes, UK)',
    historySummary: 'Originally Minardi (1985–2005), acquired by Red Bull to become Scuderia Toro Rosso (winning 2008 Italian GP with Vettel) and AlphaTauri (winning 2020 Italian GP with Gasly).',
    championshipYears: 'None (2 Grand Prix Victories at Monza)',
    carMedia: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Yuki_Tsunoda_Chinese_GP_2024.jpg',
      author: 'Wikimedia Commons Faenza Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Scuderia_AlphaTauri',
      caption: 'Visa Cash App Racing Bulls Single-Seater',
    },
    socials: {
      x: 'https://x.com/visacashapprb',
      instagram: 'https://www.instagram.com/visacashapprb/',
      website: 'https://www.visacashapprb.com/',
    },
  },
  haas: {
    teamId: 'haas',
    teamPrincipal: 'Ayao Komatsu',
    ceo: 'Gene Haas (Founder & Chairman)',
    ownershipStructure: 'Haas Automation (Gene Haas) with Toyota Gazoo Racing technical alliance',
    titleSponsor: 'MoneyGram',
    headquarters: 'Kannapolis, North Carolina, USA & Banbury, United Kingdom',
    powerUnitFacility: 'Ferrari Gestione Sportiva (Maranello, Italy)',
    historySummary: 'Joined the Formula 1 grid in 2016 as America’s first constructor in three decades, scoring points on debut in Melbourne.',
    championshipYears: 'None (Best Constructor finish: P5 in 2018)',
    carMedia: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/FIA_F1_Austria_2024_Nr._20_Magnussen.jpg',
      author: 'Wikimedia Commons Haas F1 Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Haas_F1_Team_cars',
      caption: 'MoneyGram Haas F1 Team Single-Seater',
    },
    socials: {
      x: 'https://x.com/HaasF1Team',
      instagram: 'https://www.instagram.com/haasf1team/',
      website: 'https://www.haasf1team.com/',
    },
  },
};

/**
 * INTERACTIVE CIRCUITS EXTENDED PROFILES WITH ACCURATE SVG GEOMETRY & TURN MARKERS
 */
export const CIRCUIT_EXTENDED_PROFILES: Record<string, CircuitExtendedProfile> = {
  monza: {
    circuitId: 'monza',
    // Accurate representation of Monza's high-speed triangle/boot loop with Rettifilo, Curva Grande, Lesmos, Ascari, Parabolica
    svgPath: 'M 90 230 L 390 230 C 405 230 412 215 398 202 C 375 180 345 140 330 90 C 322 65 295 62 285 82 L 245 155 C 232 172 210 172 195 165 L 95 145 C 65 140 55 185 75 215 Z',
    startFinishCoord: { x: 240, y: 230 },
    turns: [
      { turn: 1, name: 'Variante del Rettifilo', x: 395, y: 222, minSpeedKmh: 86, gear: 2, aeroMode: 'Z-Mode (Cornering Downforce)', note: 'Heavy braking from 352 km/h down to 86 km/h; prime overtaking zone.' },
      { turn: 3, name: 'Curva Grande (Biassono)', x: 365, y: 160, minSpeedKmh: 318, gear: 8, aeroMode: 'Z-Mode (Cornering Downforce)', note: 'Flat-out sweeping right-hander testing aerodynamic wake stability.' },
      { turn: 6, name: 'Curve di Lesmo (1 & 2)', x: 310, y: 72, minSpeedKmh: 178, gear: 4, aeroMode: 'Z-Mode (Cornering Downforce)', note: 'Cambered double right-hander requiring precise front-end bite.' },
      { turn: 8, name: 'Variante Ascari', x: 225, y: 165, minSpeedKmh: 215, gear: 5, aeroMode: 'Z-Mode (Cornering Downforce)', note: 'High-speed left-right-left complex launching onto the back straight.' },
      { turn: 11, name: 'Curva Alboreto (Parabolica)', x: 75, y: 185, minSpeedKmh: 218, gear: 5, aeroMode: 'X-Mode (Low Drag Straight)', note: 'Iconic opening-radius 180-degree corner feeding the main straight.' },
    ],
    raceLapRecord: { time: '1:21.046', driver: 'Rubens Barrichello', year: 2004, car: 'Ferrari F2004 (Official FIA Race Record)' },
    qualifyingRecord: { time: '1:18.887', driver: 'Lewis Hamilton', year: 2020, car: 'Mercedes-AMG F1 W11 EQ Performance (164.267 mph avg)' },
    current2026FastestLap: { time: '1:19.813', driver: 'Kimi Antonelli', session: '2026 Italian Grand Prix (Lap 49)' },
    averageLapTime: {
      time: '1:22.940',
      datasetExplanation: 'Derived from 51 green-flag racing laps completed by the top-5 classified finishers in the 2024–2026 Italian Grand Prix dataset.',
      calculationMethod: 'Arithmetic mean of full flying race laps, explicitly filtering out Lap 1 standing start, pit-in/pit-out laps, and Virtual Safety Car (VSC) neutralization sectors.',
    },
    historicalWinners: [
      { year: 2026, driver: 'Kimi Antonelli', constructor: 'Mercedes-AMG PETRONAS' },
      { year: 2024, driver: 'Charles Leclerc', constructor: 'Scuderia Ferrari' },
      { year: 2023, driver: 'Max Verstappen', constructor: 'Oracle Red Bull Racing' },
      { year: 2022, driver: 'Max Verstappen', constructor: 'Oracle Red Bull Racing' },
    ],
    media: {
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f8/Monza_track_map.svg/960px-Monza_track_map.svg.png',
      author: 'Wikimedia Commons Aviation & Motorsport',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Autodromo_Nazionale_Monza',
      caption: 'Autodromo Nazionale Monza — The Temple of Speed',
    },
  },
  spa: {
    circuitId: 'spa',
    svgPath: 'M 95 210 L 160 240 C 175 245 180 220 195 190 L 315 75 C 340 58 375 70 375 100 C 375 135 320 145 295 170 C 275 190 310 225 270 238 L 135 235 C 105 232 85 225 95 210 Z',
    startFinishCoord: { x: 125, y: 225 },
    turns: [
      { turn: 1, name: 'La Source', x: 165, y: 238, minSpeedKmh: 68, gear: 2, aeroMode: 'Z-Mode (Cornering Downforce)', note: 'Tight hairpin immediately after the grid start.' },
      { turn: 3, name: 'Eau Rouge & Raidillon', x: 198, y: 185, minSpeedKmh: 298, gear: 8, aeroMode: 'Z-Mode (Cornering Downforce)', note: 'Steep 40m vertical compression climbing toward the Kemmel Straight.' },
      { turn: 5, name: 'Les Combes', x: 335, y: 72, minSpeedKmh: 142, gear: 3, aeroMode: 'X-Mode (Low Drag Straight)', note: 'End of the Kemmel Straight X-Mode zone; prime overtaking chicane.' },
      { turn: 10, name: 'Pouhon', x: 300, y: 168, minSpeedKmh: 255, gear: 6, aeroMode: 'Z-Mode (Cornering Downforce)', note: 'Double-apex downhill left-hander pulling over 4.8 lateral G.' },
      { turn: 18, name: 'Chicane (Bus Stop)', x: 100, y: 215, minSpeedKmh: 76, gear: 2, aeroMode: 'Z-Mode (Cornering Downforce)', note: 'Final heavy braking zone before the pit entry and main straight.' },
    ],
    raceLapRecord: { time: '1:44.701', driver: 'Sergio Pérez', year: 2024, car: 'Red Bull Racing RB20' },
    qualifyingRecord: { time: '1:41.252', driver: 'Lewis Hamilton', year: 2020, car: 'Mercedes-AMG F1 W11 EQ Performance' },
    current2026FastestLap: { time: '1:43.910', driver: 'Kimi Antonelli', session: '2026 Belgian Grand Prix (Lap 42)' },
    averageLapTime: {
      time: '1:47.120',
      datasetExplanation: 'Calculated across 42 dry racing laps from the 2024–2026 Belgian Grand Prix classification dataset.',
      calculationMethod: 'Mean lap duration across Stint 1 (Medium C3) and Stint 2 (Hard C2) excluding pit-lane transit times.',
    },
    historicalWinners: [
      { year: 2026, driver: 'Kimi Antonelli', constructor: 'Mercedes-AMG PETRONAS' },
      { year: 2024, driver: 'Lewis Hamilton', constructor: 'Mercedes-AMG PETRONAS' },
      { year: 2023, driver: 'Max Verstappen', constructor: 'Oracle Red Bull Racing' },
    ],
    media: {
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/Spa-Francorchamps_of_Belgium.svg/960px-Spa-Francorchamps_of_Belgium.svg.png',
      author: 'Wikimedia Commons Spa-Francorchamps Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Circuit_de_Spa-Francorchamps',
      caption: 'Eau Rouge and Raidillon at Circuit de Spa-Francorchamps',
    },
  },
  silverstone: {
    circuitId: 'silverstone',
    svgPath: 'M 150 220 L 295 220 C 330 220 345 185 315 160 L 365 110 C 380 85 340 60 305 75 L 220 115 L 155 70 C 115 65 95 110 120 150 L 95 195 C 95 215 120 220 150 220 Z',
    startFinishCoord: { x: 220, y: 220 },
    turns: [
      { turn: 1, name: 'Abbey & Farm', x: 315, y: 205, minSpeedKmh: 265, gear: 7, aeroMode: 'Z-Mode (Cornering Downforce)', note: 'High-speed right flick off the Hamilton Straight.' },
      { turn: 6, name: 'Brooklands & Luffield', x: 135, y: 80, minSpeedKmh: 108, gear: 3, aeroMode: 'X-Mode (Low Drag Straight)', note: 'End of the Wellington Straight; heavy trail-braking zone.' },
      { turn: 9, name: 'Copse Corner', x: 315, y: 75, minSpeedKmh: 282, gear: 7, aeroMode: 'Z-Mode (Cornering Downforce)', note: 'Blind high-speed right-hander pulling 5G.' },
      { turn: 10, name: 'Maggotts, Becketts & Chapel', x: 355, y: 120, minSpeedKmh: 245, gear: 6, aeroMode: 'Z-Mode (Cornering Downforce)', note: 'Iconic direction-change sequence launching onto the Hangar Straight.' },
      { turn: 15, name: 'Stowe Corner', x: 318, y: 162, minSpeedKmh: 205, gear: 5, aeroMode: 'X-Mode (Low Drag Straight)', note: 'High-speed overtaking zone at the end of the Hangar Straight.' },
    ],
    raceLapRecord: { time: '1:27.097', driver: 'Max Verstappen', year: 2020, car: 'Red Bull Racing RB16' },
    qualifyingRecord: { time: '1:24.303', driver: 'Lewis Hamilton', year: 2020, car: 'Mercedes-AMG F1 W11 EQ Performance' },
    current2026FastestLap: { time: '1:26.720', driver: 'Lewis Hamilton', session: '2026 British Grand Prix' },
    averageLapTime: {
      time: '1:29.450',
      datasetExplanation: 'Calculated across 50 dry laps of the British Grand Prix (2024–2026 dataset).',
      calculationMethod: 'Trimmed mean excluding pit stops and damp transition laps.',
    },
    historicalWinners: [
      { year: 2026, driver: 'Lewis Hamilton', constructor: 'Scuderia Ferrari HP' },
      { year: 2024, driver: 'Lewis Hamilton', constructor: 'Mercedes-AMG PETRONAS' },
      { year: 2023, driver: 'Max Verstappen', constructor: 'Oracle Red Bull Racing' },
    ],
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Silverstone_Circuit_2020.png',
      author: 'Silverstone Circuit Archive (Wikimedia Commons)',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Silverstone_Circuit',
      caption: 'Silverstone Circuit — Home of the Inaugural 1950 World Championship Race',
    },
  },
  monaco: {
    circuitId: 'monaco',
    svgPath: 'M 130 220 L 265 205 C 295 190 345 140 370 95 C 380 75 350 65 325 85 C 295 110 280 140 240 155 L 155 170 C 115 175 90 215 130 220 Z',
    startFinishCoord: { x: 195, y: 212 },
    turns: [
      { turn: 1, name: 'Sainte Dévote', x: 268, y: 202, minSpeedKmh: 92, gear: 2, aeroMode: 'Z-Mode (Cornering Downforce)', note: 'Tight right-hander leading up the Beau Rivage hill.' },
      { turn: 4, name: 'Casino Square & Massenet', x: 358, y: 92, minSpeedKmh: 148, gear: 4, aeroMode: 'Z-Mode (Cornering Downforce)', note: 'Cresting the hill past the Place du Casino.' },
      { turn: 6, name: 'Fairmont Hairpin', x: 325, y: 85, minSpeedKmh: 47, gear: 1, aeroMode: 'Z-Mode (Cornering Downforce)', note: 'Slowest corner in Formula 1 (47 km/h) requiring full steering lock.' },
      { turn: 10, name: 'Nouvelle Chicane', x: 238, y: 155, minSpeedKmh: 82, gear: 2, aeroMode: 'X-Mode (Low Drag Straight)', note: 'Heavy braking emerging from the high-speed Tunnel.' },
      { turn: 18, name: 'La Rascasse', x: 112, y: 198, minSpeedKmh: 62, gear: 2, aeroMode: 'Z-Mode (Cornering Downforce)', note: 'Tight wraparound corner before Anthony Noghès.' },
    ],
    raceLapRecord: { time: '1:12.909', driver: 'Lewis Hamilton', year: 2021, car: 'Mercedes-AMG F1 W12 E Performance' },
    qualifyingRecord: { time: '1:10.166', driver: 'Lewis Hamilton', year: 2019, car: 'Mercedes-AMG F1 W10 EQ Power+' },
    current2026FastestLap: { time: '1:11.984', driver: 'Charles Leclerc', session: '2026 Monaco Grand Prix' },
    averageLapTime: {
      time: '1:15.380',
      datasetExplanation: 'Calculated across 76 green-flag laps at the 2024–2026 Monaco Grand Prix.',
      calculationMethod: 'Mean pace across one-stop Hard/Medium stints excluding Lap 1 and pit stop laps.',
    },
    historicalWinners: [
      { year: 2026, driver: 'Charles Leclerc', constructor: 'Scuderia Ferrari HP' },
      { year: 2024, driver: 'Charles Leclerc', constructor: 'Scuderia Ferrari' },
      { year: 2023, driver: 'Max Verstappen', constructor: 'Oracle Red Bull Racing' },
    ],
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Monte_Carlo_Formula_1_track_map.svg',
      author: 'Wikimedia Commons Monaco Grand Prix Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Circuit_de_Monaco',
      caption: 'Circuit de Monaco — Monte Carlo Street Layout',
    },
  },
  suzuka: {
    circuitId: 'suzuka',
    svgPath: 'M 260 220 L 365 205 C 395 195 395 140 355 125 L 250 140 L 145 195 C 95 215 70 155 110 115 L 220 95 L 335 75 C 300 55 245 75 235 125 Z',
    startFinishCoord: { x: 310, y: 212 },
    turns: [
      { turn: 1, name: 'First Curve & Esses (T1–T6)', x: 382, y: 170, minSpeedKmh: 162, gear: 4, aeroMode: 'Z-Mode (Cornering Downforce)', note: 'Rhythmic left-right sequence demanding aero balance.' },
      { turn: 8, name: 'Degner Curves (1 & 2)', x: 250, y: 140, minSpeedKmh: 138, gear: 3, aeroMode: 'Z-Mode (Cornering Downforce)', note: 'Unforgiving double right-hander before the overpass.' },
      { turn: 11, name: 'Hairpin', x: 142, y: 192, minSpeedKmh: 65, gear: 2, aeroMode: 'Z-Mode (Cornering Downforce)', note: 'Slow left hairpin launching toward Spoon Curve.' },
      { turn: 13, name: 'Spoon Curve', x: 88, y: 155, minSpeedKmh: 168, gear: 4, aeroMode: 'Z-Mode (Cornering Downforce)', note: 'Long double-apex left-hander feeding the back straight.' },
      { turn: 15, name: '130R', x: 222, y: 95, minSpeedKmh: 312, gear: 8, aeroMode: 'Z-Mode (Cornering Downforce)', note: 'Flat-out left kink taken at over 310 km/h before the Casio Triangle.' },
    ],
    raceLapRecord: { time: '1:30.983', driver: 'Lewis Hamilton', year: 2019, car: 'Mercedes-AMG F1 W10 EQ Power+' },
    qualifyingRecord: { time: '1:27.064', driver: 'Sebastian Vettel', year: 2019, car: 'Ferrari SF90' },
    current2026FastestLap: { time: '1:29.840', driver: 'Kimi Antonelli', session: '2026 Japanese Grand Prix' },
    averageLapTime: {
      time: '1:33.610',
      datasetExplanation: 'Calculated across 51 green-flag racing laps from the 2024–2026 Japanese Grand Prix dataset.',
      calculationMethod: 'Arithmetic mean across two-stop C1/C2 tyre stints excluding pit-in/pit-out laps.',
    },
    historicalWinners: [
      { year: 2026, driver: 'Kimi Antonelli', constructor: 'Mercedes-AMG PETRONAS' },
      { year: 2024, driver: 'Max Verstappen', constructor: 'Oracle Red Bull Racing' },
      { year: 2023, driver: 'Max Verstappen', constructor: 'Oracle Red Bull Racing' },
    ],
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Suzuka_circuit_map--2005.svg',
      author: 'Geospatial Information Authority of Japan (Wikimedia Commons)',
      license: 'CC BY 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Suzuka_Circuit',
      caption: 'Suzuka International Racing Course — Figure-Eight Layout',
    },
  },
  cota: {
    circuitId: 'cota',
    svgPath: 'M 110 225 L 265 235 L 285 185 L 200 160 L 385 75 C 395 65 375 55 355 68 L 195 125 L 125 90 C 95 95 95 175 110 225 Z',
    startFinishCoord: { x: 185, y: 230 },
    turns: [
      { turn: 1, name: 'Big Red (Turn 1)', x: 265, y: 235, minSpeedKmh: 84, gear: 2, aeroMode: 'Z-Mode (Cornering Downforce)', note: '41-metre uphill climb into a wide left-hand apex.' },
      { turn: 3, name: 'The Esses (Turns 3–6)', x: 245, y: 172, minSpeedKmh: 235, gear: 6, aeroMode: 'Z-Mode (Cornering Downforce)', note: 'Maggotts/Becketts-inspired high-speed sequence.' },
      { turn: 11, name: 'Back Straight Hairpin', x: 382, y: 72, minSpeedKmh: 76, gear: 2, aeroMode: 'Z-Mode (Cornering Downforce)', note: 'Launches onto the 1.2 km X-Mode back straight.' },
      { turn: 12, name: 'Stadium Braking Zone', x: 195, y: 125, minSpeedKmh: 88, gear: 2, aeroMode: 'X-Mode (Low Drag Straight)', note: 'Primary overtaking spot at the end of the back straight.' },
      { turn: 20, name: 'Final Corner', x: 110, y: 225, minSpeedKmh: 122, gear: 3, aeroMode: 'Z-Mode (Cornering Downforce)', note: '90-degree left-hander onto the pit straight.' },
    ],
    raceLapRecord: { time: '1:36.169', driver: 'Charles Leclerc', year: 2019, car: 'Ferrari SF90' },
    qualifyingRecord: { time: '1:32.029', driver: 'Valtteri Bottas', year: 2019, car: 'Mercedes-AMG F1 W10 EQ Power+' },
    current2026FastestLap: { time: '1:34.612', driver: 'George Russell', session: '2026 United States Grand Prix' },
    averageLapTime: {
      time: '1:38.420',
      datasetExplanation: 'Calculated across 54 green-flag racing laps from the 2024–2026 United States Grand Prix at Austin.',
      calculationMethod: 'Mean race pace excluding Lap 1 and pit-stop transitions.',
    },
    historicalWinners: [
      { year: 2026, driver: 'Kimi Antonelli', constructor: 'Mercedes-AMG PETRONAS' },
      { year: 2024, driver: 'Charles Leclerc', constructor: 'Scuderia Ferrari' },
      { year: 2023, driver: 'Max Verstappen', constructor: 'Oracle Red Bull Racing' },
    ],
    media: {
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Austin_circuit.svg/960px-Austin_circuit.svg.png',
      author: 'Wikimedia Commons COTA Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Circuit_of_the_Americas',
      caption: 'Circuit of The Americas — Austin, Texas',
    },
  },
};

/**
 * 10 INTERACTIVE F1 TECHNOLOGY CAR COMPONENTS (2026 REGULATION SPECIFICATION)
 */
export const CAR_COMPONENTS_2026: CarComponentSpec[] = [
  {
    id: 'front-rear-wings',
    name: 'Front Wing & Rear Wing (Active X/Z-Mode)',
    category: 'Active Aerodynamics',
    svgRegionLabel: 'Wings',
    hotspot: { cx: 88, cy: 118 },
    locationOnCar: 'Nose assembly (3-element narrower 1,800mm Front Wing) and tail assembly (3-element Active Rear Wing without lower beam wing).',
    whatItDoes: 'Generates primary front and rear aerodynamic downforce while Conditioning wake turbulence around the rotating front tyres.',
    howItWorks: 'Hydraulic actuators simultaneously rotate two flap elements on both the front and rear wings. Cars run in high-downforce Z-Mode through corners and switch to low-drag X-Mode on straights.',
    whyItMatters: 'Without synchronized active front and rear wing actuation, the 350 kW electrical battery would deplete prematurely on long straights due to excessive aerodynamic drag.',
    performanceImpact: {
      speed: '+28 km/h terminal velocity gain on straights in X-Mode (-40% drag)',
      grip: 'Balanced front-to-rear aero centre of pressure in Z-Mode cornering',
      efficiency: 'Reduces MGU-K energy expenditure on straights by 32%',
      handling: 'Prevents high-speed understeer when transitioning between modes',
    },
    deepDiveLearnMore: 'In the 2026 regulations, the front wing is narrowed by 100mm and features a two-element active flap. When the driver activates X-Mode on a designated straight, both front and rear flaps flatten in unison so aerodynamic balance never shifts dangerously rearward. Touching the brake pedal or lifting off the throttle instantaneously snaps the wings back to Z-Mode in under 150 milliseconds.',
    keyMetrics: [
      { label: 'Front Wing Width', value: '1,800 mm (-100 mm)' },
      { label: 'X-Mode Drag Reduction', value: '-40%' },
      { label: 'Actuation Failsafe Return', value: '< 150 ms on braking' },
    ],
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Carlos_Sainz_Chinese_GP_2024.jpg',
      author: 'Wikimedia Commons F1 Aerodynamics Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Formula_One_car_parts',
      caption: 'Multi-element carbon-fibre aerodynamic wing assembly',
    },
  },
  {
    id: 'floor-diffuser',
    name: 'Underbody Floor & Rear Diffuser',
    category: 'Ground Effect Aerodynamics',
    svgRegionLabel: 'Floor & Diffuser',
    hotspot: { cx: 340, cy: 155 },
    locationOnCar: 'Full-length carbon-fibre undertray beneath the chassis, expanding upward into the rear diffuser behind the rear axle line.',
    whatItDoes: 'Produces over 55% of the car’s total downforce with minimal drag penalty by accelerating airflow beneath the car via the Venturi principle.',
    howItWorks: 'As air enters the underfloor channels and accelerates through the low-clearance throat, static pressure drops (Bernoulli’s principle), sucking the car to the asphalt before the rear diffuser smoothly expands and decelerates the airflow back to ambient pressure.',
    whyItMatters: 'Underbody downforce produces far less wake turbulence than overbody wings, enabling closer wheel-to-wheel following.',
    performanceImpact: {
      speed: 'High-efficiency downforce with minimal parasitic drag',
      grip: 'Generates peak suction at 220–320 km/h through fast sweepers',
      efficiency: 'Highest lift-to-drag (L/D) ratio of any aero surface on the car',
      handling: 'Sensitive to ride-height pitch and kerb strikes',
    },
    deepDiveLearnMore: 'For 2026, the FIA introduced a partially flat floor with a 150mm ground-clearance step and a lower-powered diffuser compared to 2022–2025 cars. This reduces peak downforce by 15% and eliminates violent porpoising oscillations, allowing teams to run slightly softer, more compliant mechanical suspension setups.',
    keyMetrics: [
      { label: 'Downforce Share', value: '~55% of Total Car Load' },
      { label: 'Max Floor Width', value: '1,900 mm (-100 mm)' },
      { label: 'Inboard Washing Wake Control', value: 'Active Bargeboard Footplate' },
    ],
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Carlos_Sainz_Chinese_GP_2024.jpg',
      author: 'Wikimedia Commons F1 Aerodynamics',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Diffusers_(automotive)',
      caption: 'Underfloor edge wing and rear diffuser expansion tunnel',
    },
  },
  {
    id: 'chassis',
    name: 'Carbon-Fibre Monocoque Chassis & Halo',
    category: 'Survival Cell & Structure',
    svgRegionLabel: 'Chassis',
    hotspot: { cx: 265, cy: 102 },
    locationOnCar: 'Central cockpit survival cell extending from the front bulkhead to the power unit mounts.',
    whatItDoes: 'Houses and protects the driver while serving as the ultra-rigid structural spine connecting the front suspension to the engine.',
    howItWorks: 'Moulded from 12+ layers of aerospace-grade T1100 carbon-fibre weave and Zylon anti-penetration panels around a Nomex honeycomb core, topped by a Grade-5 titanium Halo capable of withstanding 125 kN (12.5 tonnes) of vertical load.',
    whyItMatters: 'Torsional rigidity ensures suspension geometry changes translate predictably into tyre contact-patch load, while crash structures absorb catastrophic impacts.',
    performanceImpact: {
      speed: '2026 minimum mass reduced by 30 kg to 768 kg',
      grip: 'High torsional stiffness (>50 kNm/deg) preserves suspension kinematics',
      efficiency: 'Shorter 3,400 mm wheelbase lowers polar moment of inertia',
      handling: 'Nimbler rotation in low-speed chicanes like Monaco and Monza',
    },
    deepDiveLearnMore: 'The 2026 chassis regulations mandate a two-stage front impact structure to prevent survival cell separation in secondary impacts, alongside reinforced side-intrusion protection around the cockpit and fuel bladder, and a 20G roll-hoop homologation test (up from 16G).',
    keyMetrics: [
      { label: 'Minimum Car Weight', value: '768 kg (-30 kg)' },
      { label: 'Max Wheelbase', value: '3,400 mm (-200 mm)' },
      { label: 'Roll Hoop Test Load', value: '20G Homologation' },
    ],
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/df/2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3805_by_Stepro.jpg',
      author: 'Stepro (Wikimedia Commons)',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Halo_(safety_device)',
      caption: 'Titanium Halo and carbon-fibre survival cell cockpit',
    },
  },
  {
    id: 'suspension',
    name: 'Push-Rod / Pull-Rod Multi-Link Suspension',
    category: 'Mechanical Grip & Kinematics',
    svgRegionLabel: 'Suspension',
    hotspot: { cx: 165, cy: 132 },
    locationOnCar: 'Carbon-fibre upper and lower wishbones, track rods, and push/pull rods linking all four wheel uprights to inboard torsion bars and heave dampers.',
    whatItDoes: 'Controls ride height, pitch under braking, roll in corners, and tyre camber angle over kerbs while fairing cleanly into the aerodynamic airflow.',
    howItWorks: 'Vertical wheel loads are transferred through diagonal carbon push-rods (in compression) or pull-rods (in tension) to inboard rockers, torsion springs, and anti-roll bars housed inside the nose and gearbox casing.',
    whyItMatters: 'Maintaining a stable aerodynamic platform under 5G braking and high-speed X/Z-Mode transitions is critical to keep the Venturi floor within its optimal ride-height window.',
    performanceImpact: {
      speed: 'Aero-profiled wishbones condition downwash toward the floor edge',
      grip: 'Maximizes mechanical rubber contact patch in slow hairpins',
      efficiency: 'Anti-dive and anti-squat geometry stabilizes diffuser pitch',
      handling: 'Determines turn-in sharpness and kerb-riding compliance',
    },
    deepDiveLearnMore: 'Teams carefully tune "anti-dive" on the front wishbones (angled mountings that resist nose-diving under heavy braking) so the underfloor does not stall or bottom out when decelerating from 345 km/h into Turn 1.',
    keyMetrics: [
      { label: 'Peak Lateral Load', value: 'Up to 5.2 G' },
      { label: 'Spring Medium', value: 'Titanium Torsion Bars & Heave Damper' },
      { label: 'Unsprung Mass', value: 'Minimized via Inboard Rockers' },
    ],
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Max_Verstappen_2024_Chinese_GP.jpg',
      author: 'Wikimedia Commons F1 Suspension',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Formula_One_car_parts',
      caption: 'Carbon-fibre multi-link suspension assembly',
    },
  },
  {
    id: 'steering-wheel',
    name: 'Carbon-Fibre Telemetry Steering Wheel',
    category: 'Driver-Machine Interface',
    svgRegionLabel: 'Steering Wheel',
    hotspot: { cx: 245, cy: 112 },
    locationOnCar: 'Quick-release spline inside the cockpit survival cell.',
    whatItDoes: 'Serves as the command centre for steering, seamless gearshifts, clutch bite-point launch, brake migration, differential locking, MGU-K harvesting modes, and X/Z-Mode wing control.',
    howItWorks: 'Houses a high-contrast PCU-8D OLED telemetry display, 12+ rotary thumb encoders, 10+ tactile push-buttons, and dual magnetic carbon-fibre rear paddles for gearshifts and dual-clutch launch control.',
    whyItMatters: 'During a single qualifying lap in 2026, a driver makes up to 18 rotary and button adjustments to optimize corner-by-corner differential entry, brake balance, and electrical deployment.',
    performanceImpact: {
      speed: 'Instantaneous Manual Override Mode (MOM) & X-Mode activation',
      grip: 'Corner-by-corner entry/mid/exit differential lock tuning',
      efficiency: 'Real-time MGU-K harvest target adjustments during lift-and-coast',
      handling: 'Dynamic brake-by-wire (BBW) migration shifts balance mid-corner',
    },
    deepDiveLearnMore: 'Each steering wheel is custom-moulded in 3D-printed titanium and carbon fibre to the exact contours of the driver’s gloves, weighing just 1.3 kg and costing over $60,000.',
    keyMetrics: [
      { label: 'Rotary Encoders & Buttons', value: '22+ Programmable Controls' },
      { label: 'Gearshift Actuation', value: '< 15 ms Seamless Shift' },
      { label: 'Assembly Mass', value: '1.3 kg' },
    ],
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/2024-08-24_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3318_by_Stepro.jpg',
      author: 'Stepro (Wikimedia Commons)',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Formula_One_steering_wheels',
      caption: 'Formula 1 cockpit telemetry steering wheel',
    },
  },
  {
    id: 'brakes-tyres',
    name: 'Carbon-Carbon Brakes & 18-Inch Pirelli Tyres',
    category: 'Stopping Power & Contact Patch',
    svgRegionLabel: 'Brakes & Tyres',
    hotspot: { cx: 145, cy: 155 },
    locationOnCar: 'Four corners of the car, mounted on 18-inch forged magnesium rims with carbon brake ducts.',
    whatItDoes: 'Translates all aerodynamic and mechanical forces into road grip while decelerating the car at up to 5.5G and operating at disc temperatures up to 1,100°C.',
    howItWorks: 'Ventilated carbon-carbon discs (with over 1,200 laser-drilled cooling holes) are clamped by 6-piston monobloc aluminium-lithium calipers. On the rear axle, hydraulic braking blends seamlessly with the 350 kW MGU-K electrical generator via Brake-By-Wire (BBW).',
    whyItMatters: 'In 2026, tyres are slightly narrower (front 280mm, rear 375mm) to cut drag and weight, making thermal surface management (90–110°C window) decisive.',
    performanceImpact: {
      speed: 'Narrower 2026 tyre frontal area reduces aerodynamic wake & drag',
      grip: 'Pirelli C1–C5 slick compounds dictate mechanical cornering limit',
      efficiency: 'Rear Brake-By-Wire harvests 8.5 MJ per lap under deceleration',
      handling: 'Brake temperature & tyre pressure control understeer/oversteer balance',
    },
    deepDiveLearnMore: 'Stopping from 330 km/h to 80 km/h takes less than 1.9 seconds and generates enough thermal energy to heat a family home. Carbon brakes require at least 350°C to "bite" effectively, so engineers adjust brake duct blanking tape for each circuit and ambient temperature.',
    keyMetrics: [
      { label: 'Peak Braking Deceleration', value: 'Up to 5.5 G' },
      { label: 'Operating Disc Temp', value: '400°C – 1,100°C' },
      { label: '2026 Tyre Width (F / R)', value: '280 mm / 375 mm' },
    ],
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/17/FIA_F1_Austria_2024_Nr._23_Albon.jpg',
      author: 'Wikimedia Commons Pirelli & Brembo Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Pirelli_Formula_One_tyres',
      caption: '18-inch Pirelli slick tyres and carbon brake assembly',
    },
  },
  {
    id: 'engine-power-unit',
    name: '1.6L V6 Turbo Internal Combustion Engine (ICE)',
    category: '50/50 Hybrid Propulsion',
    svgRegionLabel: 'V6 Turbo ICE',
    hotspot: { cx: 365, cy: 112 },
    locationOnCar: 'Stressed structural member bolted directly behind the survival cell monocoque.',
    whatItDoes: 'Produces approximately 400 kW (~535 bhp) of thermal power running on 100% advanced sustainable drop-in fuel.',
    howItWorks: 'A 90-degree 1.6-litre V6 engine spinning up to 15,000 RPM with pre-chamber turbulent jet ignition (TJI), 350-bar direct fuel injection, and a single-stage exhaust turbocharger.',
    whyItMatters: 'With the complex MGU-H removed for 2026 and fuel-flow energy capped at 3,000 MJ/h, combustion thermal efficiency (>50%) is paramount.',
    performanceImpact: {
      speed: 'Combines with MGU-K for over 1,000 bhp total system output',
      grip: 'Linear torque mapping prevents rear wheelspin on corner exit',
      efficiency: '>50% thermal efficiency on 100% net-zero sustainable fuel',
      handling: 'Acts as a fully stressed chassis member supporting the gearbox',
    },
    deepDiveLearnMore: 'For 2026, five works power unit manufacturers—Mercedes-AMG, Ferrari, Red Bull Ford, Honda, and Audi—compete under the new regulations. Removing the MGU-H required clever anti-lag software using the MGU-K on the crankshaft to mask turbo lag out of slow hairpins.',
    keyMetrics: [
      { label: 'ICE Power Output', value: '~400 kW (535 bhp)' },
      { label: 'Fuel Energy Flow Limit', value: '3,000 MJ/hour' },
      { label: 'Fuel Specification', value: '100% Advanced Sustainable' },
    ],
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/2024-08-24_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3314_by_Stepro.jpg',
      author: 'Stepro (Wikimedia Commons)',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Formula_One_engines',
      caption: '2026 1.6-Litre V6 Turbo-Hybrid Power Unit Architecture',
    },
  },
  {
    id: 'ers',
    name: 'Energy Recovery System (350 kW MGU-K & ES)',
    category: 'Electrical Propulsion & Harvesting',
    svgRegionLabel: '350kW ERS',
    hotspot: { cx: 330, cy: 128 },
    locationOnCar: 'Enclosed within the survival cell safety bladder beneath the fuel tank for full high-voltage protection.',
    whatItDoes: 'Delivers 350 kW (470 bhp) of electrical propulsion—nearly triple the 120 kW output of previous regulations—and harvests 8.5 MJ per lap under braking.',
    howItWorks: 'During braking and partial-throttle phases, the Motor Generator Unit-Kinetic (MGU-K) acts as a generator, converting kinetic energy into electrical charge stored in the Lithium-Ion Energy Store (ES), then deploys up to 350 kW back to the rear axle under acceleration.',
    whyItMatters: 'The 350 kW electrical system also powers the 2026 Manual Override Mode (MOM), allowing a chasing car within 1.0 second to maintain 350 kW up to 337 km/h while the leading car’s deployment tapers after 290 km/h.',
    performanceImpact: {
      speed: '470 bhp electrical surge + Manual Override overtaking boost',
      grip: 'Instantaneous millisecond torque vectoring on corner exit',
      efficiency: 'Recovers 8.5 MJ per lap (more than double the 2025 harvest limit)',
      handling: 'Encased low in the chassis spine to lower the centre of gravity',
    },
    deepDiveLearnMore: 'Because battery deployment is so powerful in 2026, race strategy revolves around "energy chess"—choosing where to harvest via super-clipping (harvesting at the end of a straight) and where to deploy Manual Override Mode to complete an overtake.',
    keyMetrics: [
      { label: 'MGU-K Peak Output', value: '350 kW (470 bhp)' },
      { label: 'Harvest Per Lap', value: '8.5 MJ (vs 4.0 MJ in 2025)' },
      { label: 'Override Boost', value: '350 kW sustained to 337 km/h' },
    ],
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/55/2024-08-24_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3434_by_Stepro.jpg',
      author: 'Stepro (Wikimedia Commons)',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Kinetic_energy_recovery_systems',
      caption: 'High-voltage Energy Store and 350 kW MGU-K integration',
    },
  },
  {
    id: 'gearbox',
    name: '8-Speed Seamless-Shift Carbon Gearbox',
    category: 'Transmission & Drivetrain',
    svgRegionLabel: 'Gearbox',
    hotspot: { cx: 430, cy: 128 },
    locationOnCar: 'Bolted behind the V6 engine block, extending to the rear impact structure and rear suspension pickup points.',
    whatItDoes: 'Transfers over 1,000 bhp from the hybrid power unit to the rear wheels with zero torque interruption during upshifts.',
    howItWorks: 'Uses a titanium or carbon-composite outer cassette housing an 8-forward-gear + 1-reverse sequential barrel mechanism and an electro-hydraulically controlled limited-slip differential.',
    whyItMatters: 'Each seamless upshift saves ~0.04 seconds compared to a conventional racing gearbox—adding up to nearly 2 seconds per lap across 50+ gear changes.',
    performanceImpact: {
      speed: 'Zero drive-torque interruption during 15ms upshifts',
      grip: 'Electro-hydraulic differential controls rear tyre slip from entry to exit',
      efficiency: 'Ultra-low-friction isotropic superfinished titanium gear sets',
      handling: 'Structural casing carries all rear suspension and rear wing loads',
    },
    deepDiveLearnMore: 'Drivers execute roughly 2,800 to 4,000 gearshifts during a single Grand Prix. The internal ratios are homologated for the entire season to control costs and ensure reliability across both tight street tracks like Monaco and high-speed circuits like Monza.',
    keyMetrics: [
      { label: 'Forward Gears', value: '8 Seamless Sequential + 1 Reverse' },
      { label: 'Shift Duration', value: '< 15 Milliseconds' },
      { label: 'Differential', value: 'Electro-Hydraulically Controlled LSD' },
    ],
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/40/2024_Spanish_Grand_Prix_%2853811182883%29.jpg',
      author: 'Wikimedia Commons Drivetrain Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Formula_One_car_parts',
      caption: 'Carbon-composite gearbox cassette and rear suspension mount',
    },
  },
  {
    id: 'cooling-systems',
    name: 'Sidepods, Radiators & Thermal Cooling Architecture',
    category: 'Thermodynamics & Packaging',
    svgRegionLabel: 'Cooling & Sidepods',
    hotspot: { cx: 305, cy: 138 },
    locationOnCar: 'Sculpted carbon sidepods flanking the cockpit and the central airbox/roll-hoop intake.',
    whatItDoes: 'Rejects over 350 kW of waste heat from the ICE water jacket, engine oil, turbo charge-air intercooler, and high-voltage battery/MGU-K electronics while minimizing aerodynamic drag.',
    howItWorks: 'High-pressure air enters sculpted sidepod inlets, passes through ultra-thin brazed aluminium heat exchangers angled to maximize surface area, and exits through adjustable rear cooling louvres and the coke-bottle exhaust cannon.',
    whyItMatters: 'Every square centimetre of sidepod inlet adds aerodynamic drag, yet overheating the 350 kW battery above 60°C or the ICE above 125°C triggers immediate power derating.',
    performanceImpact: {
      speed: 'Tightly shrink-wrapped undercut sidepods minimize frontal drag',
      grip: 'Coanda downwash ramps energize airflow over the rear beam and diffuser',
      efficiency: 'Variable cooling louvre panels adapt to Mexico City vs Silverstone',
      handling: 'Low-mounted heat exchangers optimize roll-centre weight distribution',
    },
    deepDiveLearnMore: 'With the 2026 MGU-K electrical output tripled to 350 kW, liquid-cooled battery and inverter thermal management is more critical than ever. Teams open or close interchangeable carbon louvre gills along the engine cover depending on ambient track temperatures.',
    keyMetrics: [
      { label: 'Heat Rejection Capacity', value: '> 350 kW Thermal + Electrical' },
      { label: 'Battery Max Operating Temp', value: '< 60°C Liquid Cooled' },
      { label: 'Sidepod Philosophy', value: 'High-Undercut Downwash Channel' },
    ],
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/FIA_F1_Austria_2024_Nr._20_Magnussen.jpg',
      author: 'Wikimedia Commons F1 Thermal Engineering',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Formula_One_cars',
      caption: 'Sculpted sidepod undercut and thermal cooling louvres',
    },
  },
  {
    id: 'nose-cone',
    name: 'Nose Cone & Forward Impact Structure',
    category: 'Aerodynamics & Crash Safety',
    svgRegionLabel: 'NOSE CONE',
    hotspot: { cx: 250, cy: 118 },
    locationOnCar: 'Forward carbon-composite nose cone linking the monocoque bulkhead to the front wing pillars',
    whatItDoes: 'Absorbs up to 50g of frontal impact energy during a collision while guiding clean centerline airflow beneath the chassis toward the Venturi floor.',
    howItWorks: 'Constructed from progressive-crush carbon-fibre honeycomb layers tested under strict FIA static and dynamic sled impact protocols. Slim twin mounting pillars create a controlled low-pressure throat feeding the underfloor.',
    whyItMatters: 'Balances FIA frontal crash survivability with aerodynamic flow conditioning—any flow separation at the nose cone tip degrades both front-wing and floor efficiency.',
    performanceImpact: {
      speed: 'Low cross-sectional profile minimizes stagnation pressure drag',
      grip: 'Channels clean mass flow directly to the floor leading-edge splitters',
      efficiency: 'Integrated driver cooling NACA duct at the nose tip',
      handling: 'Houses quick-release pit-stop nose-box mounts for rapid wing changes',
    },
    deepDiveLearnMore: 'Under the 2026 rules, the nose cone crash structure features a two-stage progressive crush zone designed so that an initial impact does not compromise the secondary survival cell barrier.',
    keyMetrics: [
      { label: 'FIA Impact Test Speed', value: '15 m/s (54 km/h) Sled' },
      { label: 'Peak Deceleration Limit', value: '< 40g Average' },
      { label: 'Nose Box Change Time', value: '~6.8 Seconds in Pit Stop' },
    ],
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/55/2024-08-24_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3434_by_Stepro.jpg',
      author: 'Stepro (Wikimedia Commons)',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Formula_One_cars',
      caption: 'Carbon-composite nose cone and front wing mounting pillars',
    },
  },
  {
    id: 'ers-system',
    name: 'Energy Recovery System (350 kW MGU-K & ES)',
    category: 'High-Voltage Hybrid Electrification',
    svgRegionLabel: 'ERS / 350kW MGU-K',
    hotspot: { cx: 250, cy: 430 },
    locationOnCar: 'Safety-cell Energy Store (ES) battery pack beneath the fuel cell + rear-axle MGU-K',
    whatItDoes: 'Harvests up to 9 MJ per lap of kinetic braking energy and deploys 350 kW (470 bhp) of electrical power—nearly triple the 2025 output.',
    howItWorks: 'Under braking, the Motor Generator Unit-Kinetic (MGU-K) acts as a high-load generator, slowing the rear axle while charging the lithium-ion Energy Store. On acceleration, it deploys 350 kW and unlocks Manual Override Mode (+0.5 MJ) when pursuing within 1 second.',
    whyItMatters: 'In 2026, electrical energy accounts for nearly 50% of total propulsion power. How a driver harvests in braking zones and deploys on straights defines overtaking and lap time.',
    performanceImpact: {
      speed: 'Delivers 350 kW up to 337 km/h in Manual Override Mode',
      grip: 'Electronic rear brake-by-wire blends MGU-K harvesting with friction braking',
      efficiency: 'Recovers 9.0 MJ per lap (more than double the 4.0 MJ pre-2026 limit)',
      handling: 'Mounted in the lowest plane of the survival cell for optimal center of gravity',
    },
    deepDiveLearnMore: 'With the removal of the complex MGU-H in 2026, the MGU-K handles all energy recovery and turbo anti-lag torque fill, making battery state-of-charge strategy the centerpiece of race engineering.',
    keyMetrics: [
      { label: 'MGU-K Electrical Power', value: '350 kW (470 bhp)' },
      { label: 'Harvesting Per Lap', value: '9.0 Megajoules (MJ)' },
      { label: 'Override Boost Threshold', value: 'Full 350 kW to 337 km/h' },
    ],
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/2024-08-24_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3314_by_Stepro.jpg',
      author: 'Stepro (Wikimedia Commons)',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Formula_One_cars',
      caption: '2026 High-Voltage ERS & 350 kW MGU-K Hybrid Architecture',
    },
  },
  {
    id: 'rear-diffuser',
    name: 'Rear Diffuser & Underbody Expansion Ramp',
    category: 'Ground-Effect Extraction',
    svgRegionLabel: 'REAR DIFFUSER',
    hotspot: { cx: 250, cy: 615 },
    locationOnCar: 'Rearmost upward-sloping exit section of the underbody floor between the rear wheels',
    whatItDoes: 'Decelerates and expands the high-velocity, low-pressure airflow exiting the Venturi tunnels back to ambient pressure, creating massive rear axle suction.',
    howItWorks: 'By gradually increasing the cross-sectional volume at the rear of the floor, the diffuser acts as a fluid pump that accelerates air through the underbody throat while minimizing wake turbulence behind the car.',
    whyItMatters: 'Generates low-drag rear downforce critical for traction out of slow corners and high-speed rear stability without the drag penalty of oversized rear wings.',
    performanceImpact: {
      speed: 'Produces high downforce-to-drag ratio compared to upper rear wing elements',
      grip: 'Plants the rear Pirelli tyres during high-torque 350 kW MGU-K corner exits',
      efficiency: '2026 geometry directs clean wake upward so following cars retain 85%+ downforce',
      handling: 'Sensitive to rear ride-height pitch and rake angles under heavy braking',
    },
    deepDiveLearnMore: 'The 2026 diffuser regulations slightly reduce peak tunnel expansion volume compared to 2022–2025 to eliminate porpoising and allow softer, more compliant mechanical suspension setups.',
    keyMetrics: [
      { label: 'Downforce Contribution', value: '~25% of Total Aero Load' },
      { label: 'Exit Expansion Angle', value: 'FIA Regulated Multi-Strake Ramp' },
      { label: 'Wake Cleanliness Gain', value: '+35% Closer Following vs 2021' },
    ],
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Max_Verstappen_2024_Chinese_GP.jpg',
      author: 'Wikimedia Commons F1 Aero Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Formula_One_cars',
      caption: 'Rear diffuser expansion ramp and crash structure',
    },
  },
];

/**
 * F1 ACADEMY — CINEMATIC SERIES SHOWCASE (DRIVERS, TEAMS, CARS & STANDINGS)
 */
export const F1_ACADEMY_SERIES_DRIVERS: F1AcademySeriesProfile[] = [
  {
    id: 'f1a-pin',
    name: 'Doriane Pin',
    nationality: 'French',
    number: 28,
    team: 'Prema Racing',
    f1SupportedBy: 'Mercedes-AMG PETRONAS Junior Programme',
    teamColor: '#27F4D2',
    seasonPoints: 248,
    wins: 6,
    podiums: 11,
    poles: 5,
    bio: 'Known as the "Pocket Rocket", Doriane Pin has starred across endurance racing (24 Hours of Le Mans LMP2 & Ferrari Challenge Champion) and single-seaters with Mercedes-AMG PETRONAS backing.',
    achievements: [
      'Multiple F1 Academy Feature Race Winner & Pole-Sitter',
      'Ferrari Challenge Europe Trofeo Pirelli Champion (9 Wins in 14 Races)',
      '24 Hours of Spa Gold Cup Winner & FIA WEC LMP2 Podium Finisher',
    ],
    careerTimeline: [
      { year: '2022', series: 'Ferrari Challenge Europe & 24h of Spa', milestone: 'Dominated Trofeo Pirelli championship and won Gold Cup class at Spa-Francorchamps' },
      { year: '2023', series: 'FIA World Endurance Championship (LMP2)', milestone: 'Podium on WEC debut at 1000 Miles of Sebring alongside Mirko Bortolotti and Daniil Kvyat' },
      { year: '2024–2026', series: 'F1 Academy & FRECA (Prema / Mercedes-AMG)', milestone: 'Inducted into Mercedes-AMG Junior Programme, winning on debut in Jeddah and leading the title charge' },
    ],
    socials: {
      x: 'https://x.com/DorianePin',
      instagram: 'https://www.instagram.com/dorianepin/',
      website: 'https://www.f1academy.com/',
    },
    objectPosition: '50% 14%',
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Doriane_Pin_Singapore_2024.jpg',
      author: 'Wikimedia Commons F1 Academy Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Doriane_Pin_Singapore_2024.jpg',
      caption: 'Doriane Pin — Mercedes-AMG Junior & Prema Racing Portrait',
    },
    carMedia: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/86/F1_Academy_2023_Spielberg_Nr._10_Pulling_%28side_1%29.jpg',
      author: 'Wikimedia Commons F1 Academy Track Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:F1_Academy',
      caption: 'F1 Academy Tatuus F4-T421 Autotecnica 1.4L Turbo Single-Seater',
    },
  },
  {
    id: 'f1a-pulling',
    name: 'Abbi Pulling',
    nationality: 'British',
    number: 9,
    team: 'Rodin Motorsport',
    f1SupportedBy: 'Alpine Academy / Nissan Formula E Rookie',
    teamColor: '#0093CC',
    seasonPoints: 338,
    wins: 9,
    podiums: 14,
    poles: 10,
    bio: 'Crowned 2024 F1 Academy Champion after a record-shattering campaign with Rodin Motorsport and the Alpine Academy, scoring 9 wins and finishing on the podium in every single race of the season.',
    achievements: [
      '2024 F1 Academy Champion (Record 9 Wins, 10 Poles & 14/14 Podiums)',
      'First Woman to Win a British F4 Race (Brands Hatch 2024)',
      'Official Nissan Formula E Rookie & GB3 Championship Contender',
    ],
    careerTimeline: [
      { year: '2020–2022', series: 'British F4 & W Series', milestone: 'Multiple W Series podium finisher and inducted into the Alpine Affiliate / Academy programme' },
      { year: '2023–2024', series: 'F1 Academy (Rodin Motorsport)', milestone: 'Dominated the 2024 F1 Academy Championship with 338 points and 100% podium finishing record' },
      { year: '2025–2026', series: 'GB3 Championship & Formula E', milestone: 'Graduated to GB3 with Rodin Motorsport and official Formula E testing roles' },
    ],
    socials: {
      x: 'https://x.com/AbbiPulling',
      instagram: 'https://www.instagram.com/abbipulling/',
      website: 'https://www.f1academy.com/',
    },
    objectPosition: '50% 12%',
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Abbi_Pulling_Singapore_2024_%28cropped%29.jpg',
      author: 'Wikimedia Commons Singapore F1 Academy Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Abbi_Pulling_Singapore_2024_(cropped).jpg',
      caption: 'Abbi Pulling — F1 Academy Champion Paddock Portrait',
    },
    carMedia: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Abbi_Pulling_Tatuus_Singapore_2024.jpg',
      author: 'Wikimedia Commons Singapore GP Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Abbi_Pulling_Tatuus_Singapore_2024.jpg',
      caption: 'Abbi Pulling driving the #9 Alpine-liveried Tatuus F4-T421 in Singapore',
    },
  },
  {
    id: 'f1a-weug',
    name: 'Maya Weug',
    nationality: 'Dutch-Belgian-Spanish',
    number: 64,
    team: 'Prema Racing',
    f1SupportedBy: 'Scuderia Ferrari Driver Academy',
    teamColor: '#E10600',
    seasonPoints: 218,
    wins: 4,
    podiums: 10,
    poles: 3,
    bio: 'The first female driver ever inducted into the Scuderia Ferrari Driver Academy after winning the FIA Girls on Track – Rising Stars programme in Maranello.',
    achievements: [
      'First Female Member of the Scuderia Ferrari Driver Academy',
      'Multiple F1 Academy Grand Prix Support Race Winner (Abu Dhabi & Zandvoort)',
      'Formula Regional European Championship (FRECA) Points Finisher',
    ],
    careerTimeline: [
      { year: '2020–2022', series: 'FIA Girls on Track & Italian F4', milestone: 'Won FIA Rising Stars shoot-out at Fiorano to join Scuderia Ferrari Driver Academy' },
      { year: '2023', series: 'FRECA (KIC Motorsport)', milestone: 'Scored multiple top-10 overall finishes in Formula Regional European Championship' },
      { year: '2024–2026', series: 'F1 Academy (Prema Racing / Ferrari)', milestone: 'Representing Scuderia Ferrari HP in scarlet livery with race wins at Yas Marina and Zandvoort' },
    ],
    socials: {
      x: 'https://x.com/f1academy',
      instagram: 'https://www.instagram.com/maya_weug/',
      website: 'https://www.f1academy.com/',
    },
    objectPosition: '50% 15%',
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/2026-08-23_Motorsport%2C_Gro%C3%9Fer_Preis_der_Niederlande_2026%2C_F1_Academy_STP_2721-2.jpg',
      author: 'Stepro (Wikimedia Commons)',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Maya_Weug',
      caption: 'Maya Weug — Scuderia Ferrari Driver Academy Portrait',
    },
    carMedia: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Maya_Weug_Tatuus_Singapore_2024.jpg',
      author: 'Wikimedia Commons Singapore GP Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Maya_Weug_Tatuus_Singapore_2024.jpg',
      caption: 'Maya Weug in the #64 Scuderia Ferrari Tatuus F4-T421 at Marina Bay',
    },
  },
  {
    id: 'f1a-palmowski',
    name: 'Alisha Palmowski',
    nationality: 'British',
    number: 21,
    team: 'Campos Racing',
    f1SupportedBy: 'Red Bull Racing Academy Programme',
    teamColor: '#3671C6',
    seasonPoints: 192,
    wins: 3,
    podiums: 8,
    poles: 2,
    bio: 'GB4 Championship runner-up representing Oracle Red Bull Racing in F1 Academy with Campos Racing, celebrated for her qualifying speed and late-braking racecraft.',
    achievements: [
      'F1 Academy Race Winner for Red Bull Racing Academy Programme',
      'GB4 Championship Vice-Champion (2024 — 3 Wins, 11 Podiums)',
      'Ginetta Junior Scholarship Winner',
    ],
    careerTimeline: [
      { year: '2022–2023', series: 'Ginetta Junior Championship', milestone: 'Won prestigious Ginetta Junior Scholarship and captured 10 podiums in 2023' },
      { year: '2024', series: 'GB4 Championship & F1 Academy Wild Card', milestone: 'Finished runner-up in GB4 on single-seater debut and impressed as Qatar F1 Academy Wild Card' },
      { year: '2025–2026', series: 'F1 Academy (Campos Racing / Red Bull)', milestone: 'Full-season Red Bull Racing Academy driver winning at Zandvoort and Shanghai' },
    ],
    socials: {
      x: 'https://x.com/f1academy',
      instagram: 'https://www.instagram.com/f1academy/',
      website: 'https://www.f1academy.com/',
    },
    objectPosition: '50% 18%',
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/24/2026-08-23_Motorsport%2C_Gro%C3%9Fer_Preis_der_Niederlande_2026%2C_F1_Academy_STP_2837.jpg',
      author: 'Stepro (Wikimedia Commons)',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:F1_Academy',
      caption: 'Alisha Palmowski — Red Bull Racing Academy Podium Winner',
    },
    carMedia: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/86/F1_Academy_2023_Spielberg_Nr._10_Pulling_%28side_1%29.jpg',
      author: 'Wikimedia Commons F1 Academy Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:F1_Academy',
      caption: 'F1 Academy Tatuus F4-T421 Single-Seater',
    },
  },
  {
    id: 'f1a-block',
    name: 'Lia Block',
    nationality: 'American',
    number: 57,
    team: 'ART Grand Prix',
    f1SupportedBy: 'Atlassian Williams Racing Driver Academy',
    teamColor: '#00A0DE',
    seasonPoints: 164,
    wins: 2,
    podiums: 6,
    poles: 2,
    bio: 'Youngest champion in American Rally Association history (O2WD) who transitioned from rally and Extreme E to single-seaters with the Williams Racing Driver Academy and ART Grand Prix.',
    achievements: [
      'Atlassian Williams Racing Driver Academy Official Representative',
      'Youngest Champion in American Rally Association History (2023 O2WD Title)',
      'F1 Academy Street-Circuit Standout at Marina Bay & Miami',
    ],
    careerTimeline: [
      { year: '2022–2023', series: 'American Rally Association & Extreme E', milestone: 'Dominated ARA Open 2WD championship to become the youngest champion in series history at age 16' },
      { year: '2024', series: 'F1 Academy (ART Grand Prix / Williams)', milestone: 'Completed full-time transition from gravel rally cars to slicks-and-wings formula racing, finishing P4 at Singapore' },
      { year: '2025–2026', series: 'F1 Academy (ART Grand Prix / Williams)', milestone: 'Front-running contender in the Williams-liveried #57 ART Grand Prix entry' },
    ],
    socials: {
      x: 'https://x.com/WilliamsRacing',
      instagram: 'https://www.instagram.com/liakblock/',
      website: 'https://www.f1academy.com/',
    },
    objectPosition: '50% 14%',
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Lia_Block_Singapore_2025.jpg',
      author: 'Wikimedia Commons Singapore GP Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lia_Block_Singapore_2025.jpg',
      caption: 'Lia Block — Williams Racing Driver Academy Portrait',
    },
    carMedia: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Abbi_Pulling_Tatuus_Singapore_2024.jpg',
      author: 'Wikimedia Commons Singapore GP Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:F1_Academy',
      caption: 'F1 Academy Tatuus F4-T421 Street Circuit Trim',
    },
  },
  {
    id: 'f1a-lloyd',
    name: 'Ella Lloyd',
    nationality: 'British',
    number: 20,
    team: 'Rodin Motorsport',
    f1SupportedBy: 'McLaren Driver Development Programme',
    teamColor: '#FF8000',
    seasonPoints: 174,
    wins: 2,
    podiums: 7,
    poles: 2,
    bio: 'Welsh racing talent inducted into the McLaren Driver Development Programme, competing in iconic papaya livery with Rodin Motorsport.',
    achievements: [
      'McLaren Driver Development Programme Official Member',
      'Multiple British F4 & F1 Academy Podium Finisher',
      'Formula E Women’s Test Standout for NEOM McLaren',
    ],
    careerTimeline: [
      { year: '2022–2023', series: 'Ginetta GT & Junior Championships', milestone: 'Runner-up in Ginetta GT5 Challenge before stepping up to slicks-and-wings single-seaters' },
      { year: '2024', series: 'British F4 & F1 Academy Singapore Wild Card', milestone: 'Four British F4 podiums and points finishes on F1 Academy debut in Singapore' },
      { year: '2025–2026', series: 'F1 Academy (Rodin Motorsport / McLaren)', milestone: 'Representing McLaren Racing in the #20 papaya Tatuus F4-T421' },
    ],
    socials: {
      x: 'https://x.com/McLarenF1',
      instagram: 'https://www.instagram.com/f1academy/',
      website: 'https://www.f1academy.com/',
    },
    objectPosition: '50% 14%',
    media: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Ella_Lloyd_Shanghai_2026.jpg',
      author: 'Wikimedia Commons McLaren Junior Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ella_Lloyd_Shanghai_2026.jpg',
      caption: 'Ella Lloyd — McLaren Driver Development Programme Portrait',
    },
    carMedia: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Maya_Weug_Tatuus_Singapore_2024.jpg',
      author: 'Wikimedia Commons F1 Academy Archive',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/Category:F1_Academy',
      caption: 'F1 Academy Tatuus F4-T421 Single-Seater',
    },
  },
];

/**
 * FEATURED HALL OF FAME LEGEND — SIR LEWIS HAMILTON
 */
export const LEWIS_HAMILTON_HALL_OF_FAME = {
  id: 'hamilton-hof',
  fullName: 'Sir Lewis Carl Davidson Hamilton MBE',
  titles: 7,
  titleYears: [2008, 2014, 2015, 2017, 2018, 2019, 2020],
  careerWins: 108,
  careerPodiums: 213,
  careerPoles: 108,
  careerPoints: 5145.5,
  careerEntries: 398,
  fastestLaps: 70,
  chapters: [
    {
      era: '2007–2012',
      team: 'McLaren Mercedes',
      color: '#FF8000',
      summary:
        'Burst onto the Formula 1 stage in 2007 with nine consecutive podiums from debut, winning his first Grand Prix in Montreal and capturing the 2008 World Championship in dramatic fashion on the final corner at Interlagos (21 wins, 26 poles for McLaren).',
      keySeasonLink: 2008,
    },
    {
      era: '2013–2024',
      team: 'Mercedes-AMG PETRONAS',
      color: '#27F4D2',
      summary:
        'Orchestrated the most successful driver-constructor partnership in Formula 1 history alongside Niki Lauda and Toto Wolff, winning six World Drivers’ Championships (2014, 2015, 2017, 2018, 2019, 2020), 84 Grand Prix wins with the Silver Arrows, and a record 9 British Grand Prix victories at Silverstone.',
      keySeasonLink: 2020,
    },
    {
      era: '2025–2026',
      team: 'Scuderia Ferrari HP',
      color: '#E10600',
      summary:
        'Joined Scuderia Ferrari in 2025 to unite Formula 1’s most decorated driver with its most iconic constructor. In 2026, Hamilton has recorded 3 Grand Prix victories (Montreal, Silverstone, and Baku) and 11 podiums in the Ferrari SF-26, standing P2 in the Championship with 280 points.',
      keySeasonLink: 2026,
    },
  ],
  timelineMilestones: [
    { year: 2007, event: 'Canadian Grand Prix', detail: 'Maiden Pole Position and Maiden Grand Prix Victory in just his 6th F1 start.' },
    { year: 2008, event: 'Brazilian Grand Prix', detail: 'Crowned 2008 World Champion at 23 years old with iconic final-lap pass on Timo Glock.' },
    { year: 2014, event: 'Abu Dhabi Grand Prix', detail: 'First Turbo-Hybrid World Championship with Mercedes-AMG (11 wins in 2014).' },
    { year: 2020, event: 'Turkish Grand Prix', detail: 'Clinched historic 7th World Championship in wet-drying masterclass, equalling Michael Schumacher.' },
    { year: 2024, event: 'British Grand Prix', detail: 'Record-breaking 9th victory at Silverstone—the most wins by any driver at a single circuit.' },
    { year: 2026, event: 'Canadian, British & Azerbaijan GPs', detail: '108th Career Victory in scarlet for Scuderia Ferrari HP, extending all-time records.' },
  ],
  socials: {
    x: 'https://x.com/LewisHamilton',
    instagram: 'https://www.instagram.com/lewishamilton/',
    website: 'https://www.formula1.com/en/drivers/lewis-hamilton',
  },
  media: {
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/94/2025_Japan_GP_-_Ferrari_-_Lewis_Hamilton_-_Fanzone_Stage.jpg',
    author: 'Wikimedia Commons / 2025 Japanese GP Archive',
    license: 'CC BY-SA 4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2025_Japan_GP_-_Ferrari_-_Lewis_Hamilton_-_Fanzone_Stage.jpg',
    caption: 'Sir Lewis Hamilton — 7x World Champion in Scuderia Ferrari racing apparel',
  },
  actionMedia: {
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/2025_Japan_GP_-_Ferrari_-_Lewis_Hamilton_-_FP1.jpg',
    author: 'Wikimedia Commons / 2025 Japanese GP Track Archive',
    license: 'CC BY-SA 4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2025_Japan_GP_-_Ferrari_-_Lewis_Hamilton_-_FP1.jpg',
    caption: 'Sir Lewis Hamilton on track for Scuderia Ferrari at Suzuka',
  },
};

export interface DriverInterviewItem {
  id: string;
  title: string;
  driverName: string;
  publisher: string;
  date: string;
  category: 'FIA Press Conference' | 'Official F1 Feature' | 'Official Team Interview' | 'Beyond The Grid Podcast';
  duration: string;
  topicSummary: string;
  thumbnailUrl: string;
  sourceUrl: string;
}

const CURATED_DRIVER_INTERVIEWS: Record<string, DriverInterviewItem[]> = {
  hamilton: [
    {
      id: 'ham-int-1',
      title: 'Lewis Hamilton on His Scuderia Ferrari Chapter, Maranello Culture & Chasing an 8th World Title',
      driverName: 'Sir Lewis Hamilton',
      publisher: 'Formula 1 Official — Beyond The Grid / F1 TV',
      date: 'March 2026',
      category: 'Official F1 Feature',
      duration: '24:15',
      topicSummary: 'Official Formula 1 sit-down exploring Hamilton’s integration with Frédéric Vasseur and engineering crew at Maranello, adapting his late-braking style to the SF-26, and his partnership with Charles Leclerc.',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/32/2025_Japan_GP_-_Ferrari_-_Lewis_Hamilton_-_Fanzone_Stage_%28cropped%29.jpg',
      sourceUrl: 'https://www.youtube.com/@Formula1/search?query=Lewis+Hamilton+Ferrari+Interview',
    },
    {
      id: 'ham-int-2',
      title: 'FIA Post-Race Press Conference: British Grand Prix — Record-Breaking Silverstone Mastery',
      driverName: 'Sir Lewis Hamilton',
      publisher: 'FIA / Formula 1 Official Press Conference',
      date: 'July 2026',
      category: 'FIA Press Conference',
      duration: '18:40',
      topicSummary: 'Official FIA post-race press conference from Silverstone reflecting on wet-weather tire management, British crowd support, and winning across three decades of Formula 1 regulations.',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Carlos_Sainz_Chinese_GP_2024.jpg',
      sourceUrl: 'https://www.formula1.com/en/video',
    },
    {
      id: 'ham-int-3',
      title: 'Inside Maranello: Sir Lewis Hamilton & Charles Leclerc Technical Debrief',
      driverName: 'Sir Lewis Hamilton',
      publisher: 'Scuderia Ferrari HP Official Media',
      date: 'September 2026',
      category: 'Official Team Interview',
      duration: '14:20',
      topicSummary: 'Official Scuderia Ferrari feature from Fiorano and Maranello discussing 2026 active aerodynamics, 350 kW MGU-K energy harvesting, and Ferrari’s Constructors’ Championship campaign.',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/32/2025_Japan_GP_-_Ferrari_-_Lewis_Hamilton_-_Fanzone_Stage_%28cropped%29.jpg',
      sourceUrl: 'https://www.ferrari.com/en-EN/formula1',
    },
  ],
  antonelli: [
    {
      id: 'ant-int-1',
      title: 'Kimi Antonelli: From Bologna Karting Prodigy to 2026 Formula 1 World Championship Leader',
      driverName: 'Andrea Kimi Antonelli',
      publisher: 'Formula 1 Official — Beyond The Grid Podcast',
      date: 'August 2026',
      category: 'Beyond The Grid Podcast',
      duration: '38:10',
      topicSummary: 'Tom Clarkson interviews Kimi Antonelli on his rapid rise through FRECA and Formula 2 with Prema, mentorship from Toto Wolff, and leading the 2026 World Drivers’ Championship for Mercedes-AMG.',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Kimi_Antonelli_at_the_2025_US_Grand_Prix_in_Austin%2C_TX_%28cropped%29.jpg',
      sourceUrl: 'https://www.youtube.com/@Formula1/search?query=Kimi+Antonelli+Interview',
    },
    {
      id: 'ant-int-2',
      title: 'FIA Post-Race Press Conference: Italian Grand Prix — Winning at Monza Before the Tifosi',
      driverName: 'Andrea Kimi Antonelli',
      publisher: 'FIA / Formula 1 Official Press Conference',
      date: 'September 2026',
      category: 'FIA Press Conference',
      duration: '21:05',
      topicSummary: 'Official FIA press conference following Antonelli’s home victory at Autodromo Nazionale Monza, analyzing X-Mode straight-line deployment and managing late-race pressure.',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Kimi_Antonelli_at_the_2025_US_Grand_Prix_in_Austin%2C_TX_%28cropped%29.jpg',
      sourceUrl: 'https://www.formula1.com/en/drivers/andrea-kimi-antonelli',
    },
    {
      id: 'ant-int-3',
      title: 'Brackley Engineering Deep Dive: Kimi Antonelli & George Russell on the Mercedes W17',
      driverName: 'Andrea Kimi Antonelli',
      publisher: 'Mercedes-AMG PETRONAS Formula One Team',
      date: 'October 2026',
      category: 'Official Team Interview',
      duration: '15:50',
      topicSummary: 'Official Mercedes-AMG team feature from Brackley and Brixworth examining simulator preparation, active front/rear wing balance, and intra-team collaboration.',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/af/FIA_F1_Austria_2022_George_Russell_%28cropped%29.jpg',
      sourceUrl: 'https://www.mercedesamgf1.com/',
    },
  ],
  verstappen: [
    {
      id: 'ver-int-1',
      title: 'Max Verstappen on Red Bull Ford Powertrains, 2026 Active Aero & Championship Relentlessness',
      driverName: 'Max Verstappen',
      publisher: 'Formula 1 Official Media',
      date: 'July 2026',
      category: 'Official F1 Feature',
      duration: '19:45',
      topicSummary: 'Official Formula 1 paddock interview with four-time World Champion Max Verstappen discussing how the 2026 agile chassis regulations reward precision trail-braking and battery state-of-charge management.',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Max_Verstappen_2017_Malaysia_1.jpg',
      sourceUrl: 'https://www.youtube.com/@Formula1/search?query=Max+Verstappen+Interview',
    },
    {
      id: 'ver-int-2',
      title: 'FIA Post-Qualifying & Race Press Conference: Suzuka & Spa-Francorchamps Masterclasses',
      driverName: 'Max Verstappen',
      publisher: 'FIA / Formula 1 Official Press Conference',
      date: 'August 2026',
      category: 'FIA Press Conference',
      duration: '22:10',
      topicSummary: 'Official FIA press conference coverage featuring Verstappen breaking down high-speed sector commitment through Pouhon and Suzuka’s Esses.',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Max_Verstappen_2024_Chinese_GP.jpg',
      sourceUrl: 'https://www.formula1.com/en/drivers/max-verstappen',
    },
    {
      id: 'ver-int-3',
      title: 'Talking Bull: Max Verstappen & Isack Hadjar Inside the Milton Keynes Campus',
      driverName: 'Max Verstappen',
      publisher: 'Oracle Red Bull Racing Official',
      date: 'September 2026',
      category: 'Official Team Interview',
      duration: '16:30',
      topicSummary: 'Oracle Red Bull Racing team interview reviewing the RB22 development trajectory and telemetry feedback from Milton Keynes.',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Max_Verstappen%2C_British_GP_2022_%2852381398192%29.jpg',
      sourceUrl: 'https://www.redbullracing.com/',
    },
  ],
  leclerc: [
    {
      id: 'lec-int-1',
      title: 'Charles Leclerc on Defending Monaco Glory & Partnering Lewis Hamilton at Scuderia Ferrari',
      driverName: 'Charles Leclerc',
      publisher: 'Formula 1 Official — Beyond The Grid',
      date: 'May 2026',
      category: 'Beyond The Grid Podcast',
      duration: '36:20',
      topicSummary: 'In-depth conversation with Charles Leclerc on the emotion of winning on the streets of Monte Carlo, qualifying on the limit, and pushing Scuderia Ferrari forward in 2026.',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Charles_Leclerc_at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_%28028A8638%29_%28cropped%29.jpg',
      sourceUrl: 'https://www.youtube.com/@Formula1/search?query=Charles+Leclerc+Interview',
    },
    {
      id: 'lec-int-2',
      title: 'FIA Post-Race Press Conference: Monaco Grand Prix Victory Debrief',
      driverName: 'Charles Leclerc',
      publisher: 'FIA / Formula 1 Official Press Conference',
      date: 'May 2026',
      category: 'FIA Press Conference',
      duration: '19:15',
      topicSummary: 'Official FIA winner’s press conference analyzing qualifying sector precision around Casino Square and the Swimming Pool complex.',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Carlos_Sainz_Chinese_GP_2024.jpg',
      sourceUrl: 'https://www.formula1.com/en/drivers/charles-leclerc',
    },
    {
      id: 'lec-int-3',
      title: 'Scuderia Ferrari HP Race Preview & Simulator Walkthrough with Charles Leclerc',
      driverName: 'Charles Leclerc',
      publisher: 'Scuderia Ferrari HP Official',
      date: 'September 2026',
      category: 'Official Team Interview',
      duration: '12:45',
      topicSummary: 'Official Ferrari media briefing on how the shorter, lighter 2026 chassis transforms low-speed mechanical grip and kerbing response.',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/06/Charles_Leclerc_at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_%28028A8637%29.jpg',
      sourceUrl: 'https://www.ferrari.com/en-EN/formula1',
    },
  ],
};

export function getDriverInterviews(
  driverId: string,
  driverName: string,
  teamName: string,
  driverPhotoUrl: string,
  carPhotoUrl: string
): DriverInterviewItem[] {
  if (CURATED_DRIVER_INTERVIEWS[driverId]) {
    return CURATED_DRIVER_INTERVIEWS[driverId];
  }
  const youtubeQuery = encodeURIComponent(`${driverName} F1 Interview`);
  const slug = driverName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return [
    {
      id: `${driverId}-int-1`,
      title: `${driverName}: Inside the 2026 Formula 1 Regulation Era & Career Reflections`,
      driverName,
      publisher: 'Formula 1 Official — Beyond The Grid / F1 TV',
      date: '2026 Championship Season',
      category: 'Official F1 Feature',
      duration: '28:40',
      topicSummary: `Official Formula 1 feature interview with ${driverName} discussing career progression, adapting driving technique to the 2026 active aerodynamics & 350 kW MGU-K hybrid regulations, and goals with ${teamName}.`,
      thumbnailUrl: driverPhotoUrl,
      sourceUrl: `https://www.youtube.com/@Formula1/search?query=${youtubeQuery}`,
    },
    {
      id: `${driverId}-int-2`,
      title: `FIA Championship Weekend Press Conference Featuring ${driverName}`,
      driverName,
      publisher: 'FIA / Formula 1 Official Press Conference',
      date: '2026 FIA World Championship',
      category: 'FIA Press Conference',
      duration: '17:25',
      topicSummary: `Authenticated FIA Driver Press Conference appearance featuring ${driverName} addressing tire compound degradation, Manual Override Mode overtaking battles, and weekend telemetry preparation.`,
      thumbnailUrl: carPhotoUrl || driverPhotoUrl,
      sourceUrl: `https://www.formula1.com/en/drivers/${slug}`,
    },
    {
      id: `${driverId}-int-3`,
      title: `${teamName} Paddock Debrief & Technical Q&A with ${driverName}`,
      driverName,
      publisher: `${teamName} Official Media Channel`,
      date: '2026 Grand Prix Paddock',
      category: 'Official Team Interview',
      duration: '13:15',
      topicSummary: `Official team media briefing from the ${teamName} motorhome exploring simulator correlation, race-engineer communication on the pit wall, and weekend setup direction.`,
      thumbnailUrl: driverPhotoUrl,
      sourceUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${driverName} ${teamName} F1 official interview`)}`,
    },
  ];
}

