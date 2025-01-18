import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/Product';
import { ProductsService } from '../../services/products/products.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Stylist } from '../../models/Stylist';
import { finalize } from 'rxjs';
import {CartItem} from '../../models/cart-item';
import {CartService} from '../../services/cart/cart.service';
import {ToastrService} from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../../services/auth/auth.service';
import { ImageService } from '../../services/image/image.service';
import { Measure } from '../../models/measure';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  private fullFilteredProducts: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];

  selectedCategory: string = '';
  selectedStylistId: number | null = null;
  sortBy: 'price_asc' | 'price_desc' | 'rating' | 'newest' = 'price_asc';

  loading: boolean = false;
  error: string = '';

  currentPage = 1;
  pageSize: number = 24;
  totalPages: number = 0;

  // construction de l'url de l'image
  getImageUrl(productId: number): string {
    return ` http://localhost:8000/storage/products/${productId}.png; `;
  }

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


  constructor(private productsService: ProductsService, private userService: AuthService,private cartService : CartService, private toastr: ToastrService, private sanitizer: DomSanitizer, private imageService: ImageService) {}

  ngOnInit() {
    this.loadProducts();
    this.updatePagination();
  }

  private loadProducts() {
    this.loading = true;
    this.error = '';

    if (this.selectedCategory) {
      this.loadProductsByCategory();
    } else if (this.selectedStylistId) {
      this.loadProductsByStylist();
    } else {
      this.loadAllProducts();
    }
  }

  stylistOptions: Stylist[] = [];

  private updateStylistOptions() {
    const uniqueStylists = new Map<number, Stylist>();

    this.products.forEach(product => {
      if (product.stylist && product.stylist.id && product.stylist.user) {
        if (!uniqueStylists.has(product.stylist.id)) {
          uniqueStylists.set(product.stylist.id, product.stylist); // On stocke le styliste directement
        }
      }
    });

    this.stylistOptions = Array.from(uniqueStylists.values())
      .sort((a, b) => a.user.nom.localeCompare(b.user.nom));
  }

  private loadAllProducts() {
    this.productsService.getAllProducts()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (products) => {
          this.products = products;
          this.products.forEach(product => {
            console.log(product.image);
          } );
          this.updateCategories();
          this.updateStylistOptions();
          this.filterProducts(); // Utilisez filterProducts au lieu d'assigner directement
        },
        error: (err) => {
          this.error = `Erreur lors du chargement des produits: ${err.message || 'Erreur inconnue'}`;
        }
      });
  }
  

  private loadProductsByCategory() {
    if (!this.selectedCategory) return;

    this.productsService.getProductsByCategory(this.selectedCategory)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (products) => {
          this.products = products;
          this.filterProducts();
        },
        error: (err) => {
          this.error = `Erreur lors du chargement des produits: ${err.message || 'Erreur inconnue'}`;
        }
      });
  }

  private loadProductsByStylist() {
    if (!this.selectedStylistId) return;

    this.productsService.getProductsByStylist(this.selectedStylistId)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (products) => {
          this.products = products;
          this.filterProducts();
        },
        error: (err) => {
          this.error = `Erreur lors du chargement des produits: ${err.message || 'Erreur inconnue'}`;
        }
      });
  }

  private updateCategories() {
    this.categories = [...new Set(this.products.map(p => p.category))].sort();
  }

  onCategoryChange() {
    this.filterProducts();
  }

  onStylistChange() {
    this.filterProducts();
  }

  updatePagination(): void {
    // Calcule le nombre total de pages basé sur la liste complète
    this.totalPages = Math.ceil(this.fullFilteredProducts.length / this.pageSize);

    // Calcule l'index de début et de fin pour la page courante
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    // Met à jour filteredProducts avec seulement les produits de la page courante
    this.filteredProducts = this.fullFilteredProducts.slice(start, end);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  filterProducts() {
    // Stocke d'abord tous les produits filtrés
    this.fullFilteredProducts = this.products.filter(product =>
      (!this.selectedCategory || product.category === this.selectedCategory) &&
      (!this.selectedStylistId || product.stylist?.id === this.selectedStylistId)
    );

    // Applique le tri sur la liste complète
    this.sortProducts();

    // Réinitialise la page
    this.currentPage = 1;

    // Met à jour la pagination
    this.updatePagination();
  }

  sortProducts() {
    this.fullFilteredProducts.sort((a, b) => {
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

  public calculateAverageRating(product: Product): number {
    if (!product.reviews?.length) return 0;
    const sum = product.reviews.reduce((acc, review) => acc + review.note, 0);
    return sum / product.reviews.length;
  }

  resetFilters() {
    this.selectedCategory = '';
    this.selectedStylistId = null;
    this.sortBy = 'price_asc';
    this.loadAllProducts();
  }

  addCart(product: Product) : void {
    const user = this.userService.getCurrentUser();
    if (!user) {
      this.toastr.error(
        'Vous devez être connecté pour faire des commandes',
        'Erreur'
      );
      return;
    }
    const mesure: string|null = localStorage.getItem('mesures');
    const user_measures: string|null = localStorage.getItem('user_measures');
    const parsedMesure: Measure = mesure? JSON.parse(mesure):(user_measures? JSON.parse(user_measures).filter((item: Measure) =>item.type === 0)[0]: null);
    const cartItem: CartItem = {
      id: product.id,
      name: product.nom,
      price: product.price,
      // size: this.selectedSize,
      quantity: 1,
      image: product.image,
      measure: parsedMesure
    };

    if(parsedMesure){
      this.cartService.addToCart(cartItem);

      console.log('Produit ajouté au panier.');

      // Affichage d'une notification
      this.toastr.success('Produit ajouté au panier !', 'Succès');
    }else{
      this.toastr.error(
        'Vous devez avoir pris des mesures pour acheter une tenue',
        'Erreur'
      );
    }
  }
}
