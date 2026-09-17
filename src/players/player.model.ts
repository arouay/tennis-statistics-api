import { Sex } from '../common/constants';

export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  shortName: string;
  sex: Sex;
  picture: string | null;
  country: {
    code: string;
    picture: string;
  };
  data: {
    rank: number;
    points: number;
    weight: number;
    height: number;
    age: number | null;
    last: number[];
  };
}
