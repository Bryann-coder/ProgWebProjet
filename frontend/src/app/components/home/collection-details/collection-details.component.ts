import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../../services/home.service';
import { finalize } from 'rxjs';
import {Product} from '../../../models/Product';
import {Stylist} from '../../../models/Stylist';
import {ProductsService} from '../../../services/products/products.service';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'app-collection-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './collection-details.component.html',
  styleUrls: ['./collection-details.component.css']
})
export class CollectionDetailsComponent implements OnInit {
  collection: any;  // Le type de collection pourrait être plus précis selon la structure
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  stylistOptions: Stylist[] = [];
  selectedCategory: string = '';
  selectedStylistId: number | null = null;
  sortBy: 'price_asc' | 'price_desc' | 'rating' | 'newest' = 'price_asc';
  loading: boolean = false;
  error: string = '';

  stars(rating: number): string[] {
    const fullStars = Math.floor(rating);  // Nombre d'étoiles pleines
    const halfStars = rating % 1 >= 0.5 ? 1 : 0;  // Si la note a une fraction >= 0.5, ajouter une étoile half
    const emptyStars = 5 - (fullStars + halfStars);  // Compléter avec des étoiles vides

    // Générer un tableau avec 'full', 'half', ou 'empty' pour chaque étoile
    return [
      ...Array(fullStars).fill('full'),
      ...Array(halfStars).fill('half'),
      ...Array(emptyStars).fill('empty')
    ];
  }


  constructor(
    private route: ActivatedRoute,
    private homeService: HomeService,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de la collection depuis l'URL
    const collectionId = this.route.snapshot.paramMap.get('id');

    if (!collectionId) {
      this.error = 'ID de collection non trouvé';
      return;
    }

    this.loadCollection(parseInt(collectionId));
  }

  private loadCollection(collectionId: number): void {
    this.loading = true;
    this.homeService.getProducts().subscribe({
      next: (products: Product[]) => {
        const collections = this.homeService.groupProductsRandomly(products, 21);
        const foundCollection = collections.find(c => c.id === collectionId);

        if (foundCollection) {
          this.collection = foundCollection;
          this.products = foundCollection.items;
          this.filteredProducts = this.products;
          this.updateCategories();
          this.updateStylistOptions();
        } else {
          this.error = 'Collection non trouvée';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la collection:', err);
        this.error = 'Erreur lors du chargement de la collection';
        this.loading = false;
      }
    });
  }

  private updateCategories() {
    this.categories = [...new Set(this.products.map(p => p.category))].sort();
  }

  private updateStylistOptions() {
    const uniqueStylists = new Map<number, Stylist>();

    this.products.forEach(product => {
      if (product.stylist && product.stylist.id && product.stylist.user) {
        if (!uniqueStylists.has(product.stylist.id)) {
          uniqueStylists.set(product.stylist.id, product.stylist);
        }
      }
    });

    this.stylistOptions = Array.from(uniqueStylists.values())
      .sort((a, b) => a.user.nom.localeCompare(b.user.nom));
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product =>
      (!this.selectedCategory || product.category === this.selectedCategory) &&
      (!this.selectedStylistId || product.stylist?.id === this.selectedStylistId)
    );
    this.sortProducts();
  }

  sortProducts() {
    this.filteredProducts.sort((a, b) => {
      switch (this.sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'rating':
          const aRating = this.calculateAverageRating(a);
          const bRating = this.calculateAverageRating(b);
          return bRating - aRating;
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });
  }

  calculateAverageRating(product: Product): number {
    if (!product.reviews?.length) return 0;
    const sum = product.reviews.reduce((acc, review) => acc + review.note, 0);
    return sum / product.reviews.length;
  }

  resetFilters() {
    this.selectedCategory = '';
    this.selectedStylistId = null;
    this.sortBy = 'price_asc';
    this.filteredProducts = this.products;
  }

  getImageUrl(product: Product): string {
    return product.image || 'assets/placeholder.jpg';
  }
}