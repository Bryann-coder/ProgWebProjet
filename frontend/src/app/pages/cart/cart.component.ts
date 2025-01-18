import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CartService} from '../../services/cart/cart.service';
import {CartItem} from '../../models/cart-item';
import {ToastrService} from 'ngx-toastr';


@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterModule, FormsModule],
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService, private router : Router, private toastr : ToastrService) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
  }

  updateQuantity(index: number, quantity: number): void {
    if (quantity < 1) return;
    this.cartItems[index].quantity = quantity;
    this.cartService.updateCart(this.cartItems);
  }

  removeItem(index: number): void {
    this.cartItems.splice(index, 1);
    this.cartService.updateCart(this.cartItems);
  }

  calculateTotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  }

  checkout(): void {
    if (this.cartItems.length > 0) {
      this.toastr.success('Veuillez effectuer le paiement', 'Commande envoyé avec Succès');
      this.cartService.sendOrders();
      this.cartService.clearCart();
      this.cartItems = [];
      this.router.navigate(['/payment']);
    } else {
      this.toastr.error('Votre panier est vide.', 'Erreur');
    }
  }
}
