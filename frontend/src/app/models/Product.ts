import {Stylist} from './Stylist';
import {Review} from './Review';
import {Timestamp} from './timestamp';

export interface Product{
  id: number;
  stylist_id: number;
  nom: string;
  description: string;
  price: number;
  category: string;
  image: string;
  sizes: string[];
  stylist?: Stylist;
  reviews?: Review[];
  created_at: Date;
}
