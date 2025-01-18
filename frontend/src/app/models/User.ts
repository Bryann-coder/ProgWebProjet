import { Measure } from './measure';
import {Timestamp} from './timestamp';

export interface User extends Timestamp{
  id: number;
  nom: string;
  email: string;
  role: string;
  mesures: Measure[]
}
