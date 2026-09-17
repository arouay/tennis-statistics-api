import { Country } from '../countries/country.model';

export interface PlayerStat {
  country: Country;
  weightGrams: number;
  heightCm: number;
  lastResults: number[];
}

export interface CountryWinRatio extends Country {
  winRatio: number;
}

export interface StatisticsSummary {
  topCountryByWinRatio: CountryWinRatio | null;
  averageBmi: number | null;
  medianHeight: number | null;
}
