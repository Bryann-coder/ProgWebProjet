import {User} from './User';
import {Product} from './Product';
import {Review} from './Review';
import {Workday} from './Workday';
import {Order} from './order';


export interface Stylist {
  id: number;
  user_id: number;
  bibliography: string;
  specialite: string;
  rating: number;
  image: string;
  photo: string;
  user: User;
  products: Product[];
  workdays: Workday[];
  reviews: Review[];
  orders: Order[];
}
