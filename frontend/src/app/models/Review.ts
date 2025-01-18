import {Product} from './Product';
import {User} from './User';

export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  note: number;
  commentaire: string;
  user: User;
  product: Product;
  created_at: string | null;
  updated_at: string | null;
}
