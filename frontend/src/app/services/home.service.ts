import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {environment} from '../@core/environnment';
import {Product} from '../models/Product';
import {Stylist} from '../models/Stylist';
import { ImageService } from './image/image.service';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient, private imageService: ImageService) {}

  // Récupérer les produits
  getProducts(): Observable<Product[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`).pipe(
      map(products =>
        products.map(product => ({
          ...product,
          image: this.imageService.updateImageUrl(product.image)
           // Modifier le champ photo
        }))
      )
    );;
  }



  // Récupérer les stylistes
  getStylists(): Observable<Stylist[]> {
    return this.http.get<any[]>(`${this.apiUrl}/stylists`).pipe(
      map(stylists =>
        stylists.map(stylist => ({
          ...stylist,
          photo: this.imageService.updateImageUrl(stylist.image)
           // Modifier le champ photo
        }))
      )
    );
  }

  // Récupérer les offres spéciales
  getSpecialOffers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/offers`); 
  }

  // Grouper les produits aléatoires et donner des noms
  groupProductsRandomly(products: Product[], groupSize: number): any[] {
    const shuffled = [...products].sort(() => Math.random() ); // Mélange les produits aléatoirement
    const groups = [];
    let groupName = 1; // Initialisation du nom de la collection
    let imageIndex = 0;

    for (let i = 0; i < shuffled.length; i += groupSize) {
      const groupImage = `${this.apiUrl}/storage/products/${groupName}.png`
      

      groups.push({
        id : groupName,
        name: `Collection ${groupName}`,
        items: shuffled.slice(i, i + groupSize),
        image: `/default${imageIndex}.jpeg`
      });
      imageIndex = (imageIndex + 1) % 4;
      groupName++;
    }

    return groups;
  }

  // Trier les stylistes par leur note (rating) et ne garder que les meilleurs
  sortStylistsByRating(stylists: any[]): any[] {
    return stylists.sort((a, b) => b.rating - a.rating).slice(0, 4); // Garder les 4 meilleurs stylistes
  }

  getCarouselImages(): Observable<Product[]> {
    return this.getProducts().pipe(
      map((products) => {
        const shuffled = [...products].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 6).map(product => {
          return product;
        });
      })
    );
  }
}
