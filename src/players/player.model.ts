import { Sex } from '../common/constants';
import { Country } from '../countries/country.model';

export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  shortName: string;
  sex: Sex;
  picture: string | null;
  country: Country;
  data: {
    rank: number;
    points: number;
    weight: number;
    height: number;
    age: number | null;
    last: number[];
  };
}
