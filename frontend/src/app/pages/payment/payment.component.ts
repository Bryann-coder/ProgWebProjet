import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment/payment.service';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-payment',
  imports: [FormsModule, CommonModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit{
  phoneNumber: string = '';
  retrieved_amount: string|null = localStorage.getItem('A_payer');
  amount: number = ( this.retrieved_amount!== null)?(+this.retrieved_amount):0;
  currency: string = 'XAF';
  errorMessage: string = '';
  successMessage: string = '';
  retrieved_id: string|null = localStorage.getItem('idCart');
  cart_id: number = ( this.retrieved_id!== null)?(+this.retrieved_id):0;

  constructor(private paymentService: PaymentService, private router: Router) {}

  ngOnInit(): void {
    this.retrieved_amount= localStorage.getItem('A_payer');
    this.amount= ( this.retrieved_amount!== null)?(+this.retrieved_amount):0;
  }

  onSubmit(): void {
    if (!this.phoneNumber) {
      this.errorMessage = 'Tous les champs doivent être remplis.';
      return;
    }
  
    const paymentData = {
      cart_id: this.cart_id,
      telephone: this.phoneNumber,
      // montant: this.amount,
      montant: 2,
      currency: this.currency
    };
  
    console.log('Payment Data:', paymentData); // Ajoutez ce log pour vérifier les données
  
    this.paymentService.makePayment(paymentData).subscribe(
      response => {
        this.successMessage = 'Veuillez confirmer le paiement via votre téléphone';
        this.errorMessage = '';
  
        // Rediriger vers la page de status avec l'ID du paiement dans la query string
        this.router.navigate(['/payment-status'], {
          queryParams: { message: this.successMessage }
        });
        localStorage.removeItem('A_payer');
        localStorage.removeItem('idCart');
      },
      error => {
        this.errorMessage = 'Erreur lors du traitement du paiement.';
        this.successMessage = '';
        console.error('Error:', error); // Ajoutez ce log pour vérifier l'erreur
      }
    );
  }
  
}
