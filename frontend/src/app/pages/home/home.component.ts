import {Component, OnInit} from '@angular/core';
import { forkJoin } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HomeService } from '../../services/home.service';
import {CommonModule} from '@angular/common';
import {CarouselComponent} from '../../components/home/carousel/carousel.component';
import {RouterModule} from '@angular/router';
import {HeroSectionComponent} from '../../components/home/hero-section/hero-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselComponent, RouterModule, HeroSectionComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loading: boolean = true;
  featuredCollections: any[] = [];
  popularStylists: any[] = [];
  specialOffers: any[] = [];

  stars(rating: number) {
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


  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadStylists();
    this.loadOffers();
  }

  loadProducts(): void {
    this.homeService.getProducts().subscribe(
      (products) => {
        this.featuredCollections = this.homeService.groupProductsRandomly(products, 40); // Grouper les produits en collections de 3
        this.loading = false;
      },
      (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    );
  }

  loadStylists(): void {
    this.homeService.getStylists().subscribe(
      (stylists) => {
        this.popularStylists = this.homeService.sortStylistsByRating(stylists); // Trier les stylistes par rating
      },
      (error) => {
        console.error('Error loading stylists:', error);
      }
    );
  }

  loadOffers(): void {
    // this.homeService.getSpecialOffers().subscribe(
    //   (offers) => {
    //     this.specialOffers = offers;
    //   },
    //   (error) => {
    //     console.error('Error loading offers:', error);
    //   }
    // );
  }
}
