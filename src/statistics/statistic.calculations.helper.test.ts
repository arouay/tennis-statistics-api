import { PlayerStat } from './statistic.model';
import { calculateAverageBmi, calculateBmi, calculateMedian, findTopCountryByWinRatio } from './statistic.calculations.helper';

function playerStat(overrides: Partial<PlayerStat>): PlayerStat {
  return {
    country: { code: 'SRB', picture: 'https://tenisu.latelier.co/resources/Serbie.png' },
    weightGrams: 80000,
    heightCm: 188,
    lastResults: [],
    ...overrides,
  };
}

describe('calculateBmi', () => {
  it('computes the BMI from weight in grams and height in cm', () => {
    expect(calculateBmi(80000, 188)).toBeCloseTo(22.63, 2);
  });

  it('rounds the result to 2 decimals', () => {
    expect(calculateBmi(72000, 175)).toBe(23.51);
  });
});

describe('calculateAverageBmi', () => {
  it('returns null for an empty list', () => {
    expect(calculateAverageBmi([])).toBeNull();
  });

  it('returns the BMI itself for a single player', () => {
    expect(calculateAverageBmi([{ weightGrams: 80000, heightCm: 188 }])).toBe(22.63);
  });

  it('averages the BMI across multiple players', () => {
    const result = calculateAverageBmi([
      { weightGrams: 80000, heightCm: 188 },
      { weightGrams: 72000, heightCm: 175 },
    ]);

    expect(result).toBe(23.07);
  });
});

describe('calculateMedian', () => {
  it('returns null for an empty array', () => {
    expect(calculateMedian([])).toBeNull();
  });

  it('returns the value itself for a single-element array', () => {
    expect(calculateMedian([180])).toBe(180);
  });

  it('returns the middle value for an odd-length array', () => {
    expect(calculateMedian([170, 175, 183, 183, 185, 185, 188])).toBe(183);
  });

  it('returns the average of the two middle values for an even-length array', () => {
    expect(calculateMedian([170, 175, 183, 185])).toBe(179);
  });

  it('does not depend on input order', () => {
    expect(calculateMedian([188, 170, 183])).toBe(183);
  });

  it('handles duplicate values', () => {
    expect(calculateMedian([180, 180, 180])).toBe(180);
  });
});

describe('findTopCountryByWinRatio', () => {
  it('returns null for an empty list', () => {
    expect(findTopCountryByWinRatio([])).toBeNull();
  });

  it('returns the only country when there is a single one', () => {
    const result = findTopCountryByWinRatio([playerStat({ lastResults: [1, 1, 0, 1, 1] })]);

    expect(result).toEqual({
      code: 'SRB',
      picture: 'https://tenisu.latelier.co/resources/Serbie.png',
      winRatio: 0.8,
    });
  });

  it('picks the country with the highest win ratio', () => {
    const result = findTopCountryByWinRatio([
      playerStat({ country: { code: 'SRB', picture: 'srb.png' }, lastResults: [1, 1, 1, 1, 1] }),
      playerStat({ country: { code: 'ESP', picture: 'esp.png' }, lastResults: [1, 0, 0, 0, 1] }),
    ]);

    expect(result?.code).toBe('SRB');
    expect(result?.winRatio).toBe(1);
  });

  it('aggregates results across multiple players of the same country', () => {
    const result = findTopCountryByWinRatio([
      playerStat({ country: { code: 'USA', picture: 'usa.png' }, lastResults: [0, 1, 1, 1, 0] }),
      playerStat({ country: { code: 'USA', picture: 'usa.png' }, lastResults: [0, 1, 0, 0, 1] }),
    ]);

    expect(result?.winRatio).toBe(0.5);
  });

  it('breaks ties alphabetically by country code', () => {
    const result = findTopCountryByWinRatio([
      playerStat({ country: { code: 'USA', picture: 'usa.png' }, lastResults: [1, 1, 0, 0] }),
      playerStat({ country: { code: 'ESP', picture: 'esp.png' }, lastResults: [1, 1, 0, 0] }),
    ]);

    expect(result?.code).toBe('ESP');
  });

  it('excludes a player with no match results from the ratio calculation', () => {
    const result = findTopCountryByWinRatio([
      playerStat({ country: { code: 'SRB', picture: 'srb.png' }, lastResults: [1, 1, 1, 1, 1] }),
      playerStat({ country: { code: 'SRB', picture: 'srb.png' }, lastResults: [] }),
    ]);

    expect(result?.winRatio).toBe(1);
  });

  it('excludes a country entirely when none of its players have any match result', () => {
    const result = findTopCountryByWinRatio([
      playerStat({ country: { code: 'SRB', picture: 'srb.png' }, lastResults: [1, 0, 1, 0] }),
      playerStat({ country: { code: 'ESP', picture: 'esp.png' }, lastResults: [] }),
    ]);

    expect(result?.code).toBe('SRB');
  });
});
