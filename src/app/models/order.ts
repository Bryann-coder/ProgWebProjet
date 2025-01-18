import {User} from './User';
import {Product} from './Product';
import {Cart} from './cart';

export interface Order {
  id: number;
  cart_id: number;
  cart: Cart;
  stylist_id: number;
  product_id: number;
  status: string;
  user: User;
  product: Product;
  prix: number;
  date: Date;
}
