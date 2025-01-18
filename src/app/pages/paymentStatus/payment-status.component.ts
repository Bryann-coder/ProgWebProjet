import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterModule} from '@angular/router';

@Component({
  selector: 'app-payment-status',
  imports: [RouterModule],
  templateUrl: './payment-status.component.html',
  styleUrl: './payment-status.component.css'
})
export class PaymentStatusComponent implements OnInit {
  message: string = '';
  status: string = 'En attente';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Récupérer le paymentId de l'URL (si tu l'as passé dans la redirection)
    this.message = this.route.snapshot.queryParamMap.get('message') || '';

    // Exemple de logique pour récupérer le status du paiement
    // Tu pourrais effectuer une requête API ici pour obtenir le statut du paiement
    if (this.message != '') {
      // Par exemple, si tu as une méthode qui récupère l'état du paiement via un service
      this.status = 'Paiement réussi'; // Exemple de statut
    } else {
      this.status = 'Erreur : Aucune information de paiement.';
    }
  }
}
