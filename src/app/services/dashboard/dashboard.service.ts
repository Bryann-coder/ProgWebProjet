import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map , switchMap} from 'rxjs/operators';
import {environment} from '../../@core/environnment';
import {Order} from '../../models/order';
import {Product} from '../../models/Product';
import {Review} from '../../models/Review';
import { ImageService } from '../image/image.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient, private imageService: ImageService) {}

  getCommandes(stylisteId: number): Observable<Order[]> {
    return this.getProduits(stylisteId).pipe(
      switchMap((produits: Product[]) => {
        const productIds = produits.map(produit => produit.id);
        return this.http.get<Order[]>(`${this.apiUrl}/orders`).pipe(
          map((commandes: Order[]) => {
            // Filtrer les commandes pour garder celles qui correspondent aux produits du styliste
            return commandes.filter(commande =>
              productIds.includes(commande.product_id)
            );
          })
        );
      })
    );
  }

  getProduits(stylisteId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      map((produits: Product[]) => {
        // Filtrer les produits pour garder ceux qui correspondent au styliste
        return produits.filter(produit =>
          produit.stylist_id === stylisteId,
        ).map(product => ({
                  ...product,
                  image: this.imageService.updateImageUrl(product.image)
          }));;
      })
    );
  }


  getReviews(produitId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/products/${produitId}/reviews`);
  }

  updateStatutCommande(commandeId: number, statut: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/orders/${commandeId}`, { statut });
  }

  updateProduit(produit: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${produit.id}`, produit);
  }

  updateOrder(orderId: number, orderData: {
    user_id: number;
    product_id: number;
    prix: number;
    status: string;
  }): Observable<any> {
    const url = `${this.apiUrl}/orders/${orderId}`;
    return this.http.patch(url, orderData);
  }

  updateProduct(productId: number, productData: {
    stylist_id: number;
    nom: string;
    description: string;
    price: number;
    category: string;
    image: string;
}): Observable<any> {
    const url = `${this.apiUrl}/products/${productId}`; // Remplacez `apiUrl` par votre URL d'API
    return this.http.patch(url, productData);
}

  addProduct (productData: {
    stylist_id: number;
    nom: string;
    description: string;
    price: number;
    category: string;
    image: string;}) : Observable<any> {
      const url = `${this.apiUrl}/products/`; // Remplacez `apiUrl` par votre URL d'API
    return this.http.post(url, productData);
    }

    deleteProduct(productId: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/products/${productId}`);
    }

}
