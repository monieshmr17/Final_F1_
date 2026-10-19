import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DRIVERS_DATA,
  TEAMS_2026,
  getDriverCareerStats,
  getDriverSeasonStats,
  validateDriverStatsSeparation,
  resolveCanonicalDriverId,
  parseStatNumber,
  formatStatValue,
  calculateHistoricalPoints,
  getSeasonStandingsTable,
} from './f1StatsEngine.ts';
import {
  getDriverExtendedMetadata,
  getDriverInterviews,
  TEAM_GOVERNANCE_AND_MEDIA,
  CIRCUIT_EXTENDED_PROFILES,
  CAR_COMPONENTS_2026,
  LEWIS_HAMILTON_HALL_OF_FAME,
  F1_ACADEMY_SERIES_DRIVERS,
} from '../data/f1MediaAndProfiles.ts';

test('Kimi Antonelli 2026 season and career statistics match official profile specification', () => {
  const season2026 = getDriverSeasonStats('antonelli', 2026);
  const career = getDriverCareerStats('antonelli');

  // 2026 Season checks
  assert.equal(season2026.position, 1);
  assert.equal(season2026.points, 325);
  assert.equal(season2026.gpWins, 8);
  assert.equal(season2026.gpPodiums, 13);
  assert.equal(season2026.gpPoles, 6);

  // Career checks
  assert.equal(career.points, 470);
  assert.equal(career.gpWins, 8);
  assert.equal(career.gpPodiums, 16);
  assert.equal(career.gpPoles, 6);
  assert.equal(career.gpEntries, 40);
  assert.equal(career.worldChampionships, 0);
});

test('All 22 drivers on the 2026 grid pass strict career vs season statistics separation', () => {
  assert.equal(DRIVERS_DATA.length, 22);
  for (const driver of DRIVERS_DATA) {
    const check = validateDriverStatsSeparation(driver);
    assert.equal(
      check.valid,
      true,
      `Validation failed for ${driver.fullName}: ${check.errors.join('; ')}`
    );
  }
});

test('Career statistics are never confused with selected-season statistics when switching seasons', () => {
  const ham2026 = getDriverSeasonStats('hamilton', 2026);
  const ham2024 = getDriverSeasonStats('hamilton', 2024);
  const hamCareer = getDriverCareerStats('hamilton');

  assert.notEqual(ham2026.points, hamCareer.points);
  assert.notEqual(ham2026.points, ham2024.points);
  assert.equal(ham2026.points, 280);
  assert.equal(ham2024.points, 223);
  assert.equal(hamCareer.worldChampionships, 7);
  assert.equal(hamCareer.gpWins, 108);

  // Requesting an unrecorded season for a driver returns unavailable status, never false 0 or career total
  const ant2020 = getDriverSeasonStats('antonelli', 2020);
  assert.equal(ant2020.status, 'unavailable');
  assert.equal(ant2020.points, null);
  assert.equal(formatStatValue(ant2020.points), 'Unavailable');
});

test('Legitimate zero is preserved while null/missing values are marked Unavailable', () => {
  const antCareer = getDriverCareerStats('antonelli');
  assert.equal(antCareer.worldChampionships, 0);
  assert.equal(formatStatValue(antCareer.worldChampionships), '0');

  assert.equal(parseStatNumber(0), 0);
  assert.equal(parseStatNumber('0'), 0);
  assert.equal(parseStatNumber(null), null);
  assert.equal(parseStatNumber(undefined), null);
  assert.equal(parseStatNumber(''), null);
  assert.equal(parseStatNumber('Unavailable'), null);
});

test('Canonical driver ID resolver handles Ergast IDs and accented names', () => {
  assert.equal(resolveCanonicalDriverId('andrea_kimi_antonelli'), 'antonelli');
  assert.equal(resolveCanonicalDriverId('max_verstappen'), 'verstappen');
  assert.equal(resolveCanonicalDriverId('Nico Hülkenberg'), 'hulkenberg');
  assert.equal(resolveCanonicalDriverId('Sergio Pérez'), 'perez');
});

test('Historical points calculator respects FIA scoring eras and Sprint rules', () => {
  assert.equal(calculateHistoricalPoints(2026, 1), 25);
  assert.equal(calculateHistoricalPoints(2026, 1, { isSprint: true }), 8);
  assert.equal(calculateHistoricalPoints(2021, 1, { fastestLap: true }), 26);
  assert.equal(calculateHistoricalPoints(2021, 1, { isSprint: true }), 3);
  assert.equal(calculateHistoricalPoints(2005, 1), 10);
  assert.equal(calculateHistoricalPoints(2005, 2), 8);
  assert.equal(calculateHistoricalPoints(1995, 1), 10);
  assert.equal(calculateHistoricalPoints(1995, 2), 6);
  assert.equal(calculateHistoricalPoints(1955, 1, { fastestLap: true }), 9);
});

test('2026 Standings table orders Kimi Antonelli P1 with 325 points and all 11 constructors exist', () => {
  const standings = getSeasonStandingsTable(2026);
  assert.equal(standings.length, 22);
  assert.equal(standings[0].driverId, 'antonelli');
  assert.equal(standings[0].seasonPoints, 325);
  assert.equal(standings[0].seasonWins, 8);
  assert.equal(standings[0].careerPoints, 470);
  assert.equal(TEAMS_2026.length, 11);
});

test('All 22 drivers, 11 teams, 6 circuits, 13 car components, interviews, and Lewis Hamilton Hall of Fame have verified media and governance metadata', () => {
  for (const d of DRIVERS_DATA) {
    const ext = getDriverExtendedMetadata(d.id, d.fullName, d.currentTeamId);
    assert.ok(ext.media.imageUrl.startsWith('https://upload.wikimedia.org/'));
    assert.ok(ext.media.license.length > 0);
    assert.ok(ext.careerTimeline.length >= 2);
    assert.ok(ext.socials.website.startsWith('https://'));

    const team = TEAMS_2026.find((t) => t.id === d.currentTeamId) || TEAMS_2026[0];
    const interviews = getDriverInterviews(
      d.id,
      d.fullName,
      team.name,
      ext.media.imageUrl,
      ext.media.imageUrl
    );
    assert.equal(interviews.length, 3);
    for (const iv of interviews) {
      assert.ok(iv.title.length > 5);
      assert.ok(iv.sourceUrl.startsWith('https://'));
      assert.ok(iv.topicSummary.length > 15);
    }
  }

  for (const t of TEAMS_2026) {
    const gov = TEAM_GOVERNANCE_AND_MEDIA[t.id];
    assert.ok(gov, `Missing governance for team ${t.id}`);
    assert.ok(gov.teamPrincipal.length > 0);
    assert.ok(gov.ceo.length > 0);
    assert.ok(gov.ownershipStructure.length > 0);
    assert.ok(gov.titleSponsor.length > 0);
    assert.ok(gov.headquarters.length > 0);
  }

  assert.equal(Object.keys(CIRCUIT_EXTENDED_PROFILES).length, 6);
  for (const c of Object.values(CIRCUIT_EXTENDED_PROFILES)) {
    assert.ok(c.svgPath.startsWith('M '));
    assert.ok(c.turns.length >= 4);
    assert.ok(c.raceLapRecord.time.length > 0);
    assert.ok(c.qualifyingRecord.time.length > 0);
    assert.ok(c.current2026FastestLap.time.length > 0);
    assert.ok(c.averageLapTime.datasetExplanation.length > 10);
  }

  assert.equal(CAR_COMPONENTS_2026.length, 13);
  assert.equal(LEWIS_HAMILTON_HALL_OF_FAME.titles, 7);
  assert.equal(LEWIS_HAMILTON_HALL_OF_FAME.careerWins, 108);
  assert.equal(LEWIS_HAMILTON_HALL_OF_FAME.chapters.length, 3);
});

test('Every Formula 1 and F1 Academy driver has a unique verified portrait URL, image-aware objectPosition, and car/action media', () => {
  const seenPortraitUrls = new Set<string>();
  for (const d of DRIVERS_DATA) {
    const ext = getDriverExtendedMetadata(d.id, d.fullName, d.currentTeamId);
    assert.ok(
      !seenPortraitUrls.has(ext.media.imageUrl),
      `Duplicate portrait URL found for ${d.fullName}: ${ext.media.imageUrl}`
    );
    seenPortraitUrls.add(ext.media.imageUrl);
    assert.ok(ext.objectPosition && ext.objectPosition.length > 0);
  }

  assert.equal(F1_ACADEMY_SERIES_DRIVERS.length, 6);
  const seenAcademyUrls = new Set<string>();
  for (const ad of F1_ACADEMY_SERIES_DRIVERS) {
    assert.ok(ad.media.imageUrl.startsWith('https://upload.wikimedia.org/'));
    assert.ok(!seenAcademyUrls.has(ad.media.imageUrl), `Duplicate F1 Academy portrait for ${ad.name}`);
    seenAcademyUrls.add(ad.media.imageUrl);
    assert.ok(ad.carMedia && ad.carMedia.imageUrl.startsWith('https://upload.wikimedia.org/'));
    assert.ok(ad.careerTimeline && ad.careerTimeline.length >= 2);
  }
});


