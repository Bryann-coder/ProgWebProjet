import {Stylist} from './Stylist';
import {User} from './User';

export interface Workday {
  id: number;
  stylist_id: number;
  status: number; // 0 for unavailable, 1 for available
  date: Date;
  stylist?: Stylist;
  user?: User;
  created_at: Date;
  updated_at: Date;
}
