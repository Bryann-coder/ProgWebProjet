import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Product } from '../../../models/Product';
import { ProductsService } from '../../../services/products/products.service';
import { CartService } from '../../../services/cart/cart.service';
import { Measure } from '../../../models/measure';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../models/cart-item';
import { BodyMeasurementsService } from '../../../services/measures/body-measurements.service';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import {MeasureComponent} from '../../measure/measure.component';
import { PageRefreshService } from '../../../services/refresh/page-refresh.service';
type MeasureKey = keyof Omit<Measure, 'id' | 'user_id'>;
@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MeasureComponent],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product: Product = {
    category: '',
    created_at: new Date(),
    stylist_id: 0,
    id: 0,
    nom: '',
    description: '',
    price: 0,
    sizes: [],
    image: '',
  };

  error: string = '';
  quantity: number = 1;
  selectedSize: string = 'L';
  uploadError: string | null = null;
  isUploading: boolean = false;


  isReviewModalOpen = false;
  rating: number = 0;
  comment: string = '';
  comments: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService,
    private cartService: CartService,
    private toastr: ToastrService,
    private userService: AuthService,
    private pageRefreshService: PageRefreshService
  ) {}

  ngOnInit(): void {
    const productId = +this.route.snapshot.paramMap.get('id')!;
    this.loadProductDetails(productId);
    this.loadComments(productId);
  }

  loadProductDetails(productId: number): void {
    this.productService.getProductById(productId).subscribe((data: any) => {
      this.product = data;
      console.log('Détails du produit:', this.product);
    });
  }

  updateMainImage(image: string): void {
    this.product.image = image;
  }


  addToCart(): void {
    const mesure: string|null = localStorage.getItem('mesures');
    const user_measures: string|null = localStorage.getItem('user_measures');
    const parsedMesure: Measure = mesure? JSON.parse(mesure):(user_measures? JSON.parse(user_measures).filter((item: Measure) =>item.type === 0)[0]: null);
    if(parsedMesure){
      const cartItem: CartItem = {
        id: this.product.id,
        name: this.product.nom,
        price: this.product.price,
        // size: this.selectedSize,
        quantity: this.quantity,
        image: this.product?.image,
        measure: parsedMesure
      };
  
      this.cartService.addToCart(cartItem);
  
      console.log('Produit ajouté au panier.');
    }else{
      this.toastr.error(
        'Vous devez avoir pris des mesures pour acheter une tenue',
        'Erreur'
      );
    }
    
  }

  loadComments(productId: number): void {
    this.productService
      .getProductReviews(productId)
      .subscribe((data: any[]) => {
        this.comments = data;
      });
  }

  openReviewModal(): void {
    this.isReviewModalOpen = true;
  }

  closeReviewModal(): void {
    this.isReviewModalOpen = false;
  }

  submitReview(): void {
    const productId = +this.route.snapshot.paramMap.get('id')!;
    const user = this.userService.getCurrentUser();
    if (!user) {
      this.toastr.error(
        'Vous devez être connecté pour soumettre un avis.',
        'Erreur'
      );
    }
    const review = {
      user_id: user?.id ?? 1,
      product_id: productId,
      note: this.rating,
      commentaire: this.comment,
    };
    this.productService.addReview(productId, review).subscribe(() => {
      this.loadComments(productId); // Recharger les commentaires après soumission
      this.closeReviewModal();
      this.pageRefreshService.refreshPage();
    });
  }
  stars(rating: number): string[] {
    const fullStars = Math.floor(rating); // Nombre d'étoiles pleines
    const halfStars = rating % 1 >= 0.5 ? 1 : 0; // Si la note a une fraction >= 0.5, ajouter une étoile half
    const emptyStars = 5 - (fullStars + halfStars); // Compléter avec des étoiles vides

    // Générer un tableau avec 'full', 'half', ou 'empty' pour chaque étoile
    return [
      ...Array(fullStars).fill('full'),
      ...Array(halfStars).fill('half'),
      ...Array(emptyStars).fill('empty'),
    ];
  }
  public calculateAverageRating(product: Product): number {
    if (!product.reviews?.length) return 0;
    const sum = product.reviews.reduce((acc, review) => acc + review.note, 0);
    return sum / product.reviews.length;
  }
}
