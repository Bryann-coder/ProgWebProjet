import { Injectable, numberAttribute } from '@angular/core';
import {CartItem} from '../../models/cart-item';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as environnment from '../../@core/environnment';
import { Order } from '../../models/order';
import { Cart } from '../../models/cart';
import { PageRefreshService } from '../refresh/page-refresh.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  private cartKey = 'cartItems';
  apiUrl = environnment.environment.apiUrl;

  constructor(
    private http: HttpClient,
    private pageRefreshService: PageRefreshService
  ) { }

  getCartItems(): CartItem[] {
    const cart = localStorage.getItem(this.cartKey);
    return cart ? JSON.parse(cart) : [];
  }

  addToCart(item: CartItem): void {
    const cart = this.getCartItems(); // Récupérer les articles existants
    const existingItem = cart.find((cartItem) => (cartItem.id === item.id)&&(cartItem.measure?.id === item.measure?.id));

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.push(item);
    }



    this.updateCart(cart); // Sauvegarder le panier mis à jour
    console.log('Cart updated:', cart);
  }

  updateCart(cartItems: CartItem[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(cartItems));
  }

  clearCart(): void {
    localStorage.removeItem(this.cartKey);
  }

  sendOrders(): void {
    const cart = this.getCartItems();
    let total: number = 0;
    if(cart.length == 0){
      return;
    }
    const user = localStorage.getItem('user');
    if (!user) return;

    try {
      const parsedUser = JSON.parse(user);
      const panier = {
        user_id : parsedUser.id
      };
      this.http.post<Cart>(`${this.apiUrl}/carts`, panier).subscribe(
        (response) => {
          console.log(response);
          localStorage.setItem('idCart',response.id.toString());
          cart.forEach((item)=> {
            for( let i: number = 0; i<item.quantity; i++){
              let order = {
                mesure_id: item.measure?.id,
                cart_id: response.id,
                product_id: item.id,
                prix: item.price,
                status: "pending"
              };
              total += +item.price;
              this.http.post<Order>(`${this.apiUrl}/orders`, order).subscribe(
                (response) => {
                  console.log(response);
                },
                (error) => {
                  console.log("Erreur lors de la création des commandes: ",error);
                }
              );
              
            }
            console.log(total);
            localStorage.setItem('A_payer',total.toString());
            this.pageRefreshService.refreshPage();
          });
        },
        (error) => {
          console.error('Erreur lors de la création de la carte: ',error);
        }
      );

    } catch (error) {
      console.error('Erreur in sendOrders: ', error);
      return;
    }
  }

  removeFromCart(itemId: number): void {
    const cart = this.getCartItems();
    const updatedCart = cart.filter((item) => item.id !== itemId);
    this.updateCart(updatedCart);
  }

}
