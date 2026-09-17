import { Country } from '../countries/country.model';
import { CountryWinRatio, PlayerStat } from './statistic.model';

export function calculateBmi(weightGrams: number, heightCm: number): number {
  const weightKg = weightGrams / 1000;
  const heightM = heightCm / 100;
  return Math.round((weightKg / heightM ** 2) * 100) / 100;
}

export function calculateAverageBmi(playerStats: { weightGrams: number; heightCm: number }[]): number | null {
  if (playerStats.length === 0) {
    return null;
  }

  const bmis = playerStats.map((playerStat) => calculateBmi(playerStat.weightGrams, playerStat.heightCm));
  const average = bmis.reduce((sum, bmi) => sum + bmi, 0) / bmis.length;
  return Math.round(average * 100) / 100;
}

export function calculateMedian(values: number[]): number | null {
  if (values.length === 0) {
    return null;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  return sorted[middle];
}

export function findTopCountryByWinRatio(playerStats: PlayerStat[]): CountryWinRatio | null {
  const totalsByCountry = new Map<string, { country: Country; wins: number; games: number }>();

  for (const playerStat of playerStats) {
    const totals = totalsByCountry.get(playerStat.country.code) ?? { country: playerStat.country, wins: 0, games: 0 };
    totals.wins += playerStat.lastResults.filter((result) => result === 1).length;
    totals.games += playerStat.lastResults.length;
    totalsByCountry.set(playerStat.country.code, totals);
  }

  const ratios: CountryWinRatio[] = [...totalsByCountry.values()]
    .filter((totals) => totals.games > 0)
    .map((totals) => ({
      code: totals.country.code,
      picture: totals.country.picture,
      winRatio: Math.round((totals.wins / totals.games) * 100) / 100,
    }));

  if (ratios.length === 0) {
    return null;
  }

  ratios.sort((a, b) => b.winRatio - a.winRatio || a.code.localeCompare(b.code));
  return ratios[0];
}
