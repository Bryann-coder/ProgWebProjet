import { Measure } from "./measure";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  measure: Measure|null;
}

