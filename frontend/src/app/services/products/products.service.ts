import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { environment } from '../../@core/environnment';
import { Product } from '../../models/Product';
import { Review } from '../../models/Review';
import { StylistsService } from '../stylists/stylists.service';
import { ImageService } from '../image/image.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
    private stylistsService: StylistsService,
    private imageService : ImageService
  ) {}
  

  // Produits avec informations des stylistes
  getAllProducts(): Observable<Product[]> {
    return forkJoin({
      products: this.http.get<Product[]>(`${this.apiUrl}/products`),
      stylists: this.stylistsService.getAllStylists()
    }).pipe(
      map(({ products, stylists }) => {
        return products.map(product => ({
          ...product,
          image: this.imageService.updateImageUrl(product.image),
          stylist: stylists.find(s => s.id === product.stylist_id) || undefined
        }));
      })
    );
    
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`).pipe(
      switchMap(product =>
        this.stylistsService.getStylistById(product.stylist_id).pipe(
          map(stylist => ({
            ...product,
            image: this.imageService.updateImageUrl(product.image),
            stylist
          }))
        )
      )
    );
  }

  getProductsByStylist(stylistId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/stylists/${stylistId}/products`).pipe(
      switchMap(products =>
        this.stylistsService.getStylistById(stylistId).pipe(
          map(stylist => products.map(product => ({
            ...product,
            image: this.imageService.updateImageUrl(product.image),
            stylist
          })))
        )
      )
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?category=${category}`).pipe(
      switchMap(products => {
        const stylistIds = [...new Set(products.map(p => p.stylist_id))];
        return forkJoin(
          stylistIds.map(id => this.stylistsService.getStylistById(id))
        ).pipe(
          map(stylists => {
            return products.map(product => ({
              ...product,
              stylist: stylists.find(s => s.id === product.stylist_id)
            }));
          })
        );
      })
    );
  }

  // Reviews
  getProductReviews(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/products/${productId}/reviews`);
  }

  addReview(productId: number, review: Partial<Review>): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/reviews`, review);
  }
}
