import { Component, OnInit, OnDestroy } from '@angular/core';
import { HomeService } from '../../../services/home.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../../models/Product';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-carousel',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  animations: [
    trigger('slide', [
      state('void', style({
        opacity: 0,
        transform: 'scale(0.95) translateX(50px)'
      })),
      transition('void => *', [
        animate('40ms ease-out', style({
          opacity: 1,
          transform: 'scale(1) translateX(0)'
        }))
      ]),
      transition('* => void', [
        animate('40ms ease-in', style({
          opacity: 0,
          transform: 'scale(0.95) translateX(-50px)'
        }))
      ])
    ])
  ]
})
export class CarouselComponent implements OnInit, OnDestroy {
  caroussel_item: Product[] = [];
  currentIndex = 0;
  autoplayInterval: any;
  isLoading = true;
  error: string | null = null;
  visibleOutfits = 3;

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.fetchCarouselImages();
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  isLastSlide(): boolean {
    return this.currentIndex >= this.caroussel_item.length - this.visibleOutfits;
  }

  fetchCarouselImages(): void {
    this.isLoading = true;
    this.error = null;

    this.homeService.getCarouselImages().subscribe({
      next: (products) => {
        this.caroussel_item = products;
        this.isLoading = false; 
      },
      error: (error) => {
        console.error('Error fetching carousel images:', error);
        this.error = 'Erreur lors du chargement des images';
        this.isLoading = false;
      }
    });
  }

  // Navigation
  next(): void {
    if (!this.isLastSlide()) {
      this.currentIndex = Math.min(
        this.currentIndex + 1,
        this.caroussel_item.length - this.visibleOutfits
      );
      this.resetAutoplay();
    }
  }

  prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex = Math.max(0, this.currentIndex - 1);
      this.resetAutoplay();
    }
  }

  goToSlide(index: number): void {
    const maxIndex = this.caroussel_item.length - this.visibleOutfits;
    this.currentIndex = Math.max(0, Math.min(index, maxIndex));
    this.resetAutoplay();
  }

  // Autoplay
  startAutoplay(): void {
    this.autoplayInterval = setInterval(() => {
      if (this.isLastSlide()) {
        this.currentIndex = 0; // Reset to beginning
      } else {
        this.next();
      }
    }, 5000);
  }

  stopAutoplay(): void {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }

  resetAutoplay(): void {
    this.stopAutoplay();
    this.startAutoplay();
  }

  // Event handlers
  onMouseEnter(): void {
    this.stopAutoplay();
  }

  onMouseLeave(): void {
    this.startAutoplay();
  }

  // Helpers
  trackByFn(index: number, item: Product): number {
    return item.id || index;
  }

  isCurrentSlide(index: number): boolean {
    return this.currentIndex === index;
  }

  // Loading state
  get isDataAvailable(): boolean {
    return !this.isLoading && this.caroussel_item.length > 0;
  }

  getCurrentImageUrl(): string {
    return this.caroussel_item[this.currentIndex]?.image || '';
  }

  getThumbnails(): Product[] {
    return this.caroussel_item.slice(0, 5);
  }
}