import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Stylist} from '../../../models/Stylist';
import {StylistsService} from '../../../services/stylists/stylists.service';
import {Product} from '../../../models/Product';
import {CartItem} from '../../../models/cart-item';
import {CartService} from '../../../services/cart/cart.service';
import {ToastrService} from 'ngx-toastr';
import {WorkdaysService} from '../../../services/workdays/workdays.service';
import {Workday} from '../../../models/Workday';
import {Review} from '../../../models/Review';

@Component({
  selector: 'app-stylist-details',
  standalone:true,
  imports:[RouterModule, CommonModule, FormsModule],
  templateUrl: './stylist-details.component.html',
  styleUrls: ['./stylist-details.component.css'],
})

export class StylistDetailsComponent implements OnInit {
  stylist: Stylist | null = null;
  workdays: Workday[] | [] = [];
  productsPerPage = 8; // Nombre de produits par page
  currentPage = 1; // Page actuelle
  private _hasReviews: boolean = false;
  reviews : Review[] = []

  constructor(
    private route: ActivatedRoute,
    private stylistService: StylistsService,
    private cartService: CartService,
    private toastr: ToastrService,
    private workdayService: WorkdaysService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.fetchStylistById(+id);
    } else {
      console.error('Aucun ID trouvé dans les paramètres de la route');
    }
  }

  fetchStylistById(id: number): void {
    this.stylistService.getStylistById(id).subscribe({
      next: (data) => {
        this.stylist = data;
        this.calculateHasReviews();
        this.fetchReviewsByStylistId(id)
        console.log('Données du styliste chargées :', this.stylist);
      },
      error: (err) => console.error('Erreur lors du chargement du styliste:', err),
    });
  }

  fetchWorkdaysByStylistId(id: number): void {
    this.workdayService.getWorkdaysByStylist(id).subscribe({
      next: (data) => (this.workdays = data),
      error: (err) => console.error('Erreur lors du chargement des jours de travail:', err),
    });
  }

  getStars(rating: number = this.stylist?.rating || 0): string[] {
    return Array(Math.round(rating)).fill('★');
  }

  fetchReviewsByStylistId(stylistId: number): void {
    if (!stylistId) {
      console.warn('ID du styliste manquant.');
      return;
    }

    this.stylistService.getReviewsbyStylist(stylistId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        console.log(`Avis récupérés pour le styliste (ID: ${stylistId}) :`, reviews);
      },
      error: (err) => console.error('Erreur lors de la récupération des avis :', err),
    });
  }


  private calculateHasReviews(): void {
    if (!this.stylist?.id) {
      console.warn('ID du styliste manquant.');
      this._hasReviews = false;
      return;
    }

    this.stylistService.getReviewsbyStylist(this.stylist.id).subscribe({
      next: (reviews) => {
        this._hasReviews = reviews && reviews.length > 0;
        console.log(
          this._hasReviews ? 'Le styliste a des avis.' : 'Aucun avis pour ce styliste.'
        );
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des avis :', err);
        this._hasReviews = false; // En cas d'erreur, définir à false
      },
    });
  }

  get hasReviews(): boolean {
    console.log(this._hasReviews)
    return this._hasReviews;
  }

  addToCart(product: Product) : void {
    const cartItem : CartItem = {
      id: product.id,
      name: product.nom,
      price: product.price,
      // size: this.selectedSize,
      quantity: 1,
      image: product.image,
      measure: null
    };


    this.cartService.addToCart(cartItem);

    console.log('Produit ajouté au panier.');

    // Affichage d'une notification
    this.toastr.success('Produit ajouté au panier !', 'Succès');
  }


  get paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;
    return this.stylist?.products?.slice(startIndex, endIndex) || [];
  }

  get totalPages() {
    return Math.ceil((this.stylist?.products?.length || 0) / this.productsPerPage);
  }

  goToPage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
