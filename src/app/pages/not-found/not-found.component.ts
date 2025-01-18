// not-found.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  animations: [
    trigger('bounceAnimation', [
      transition('* => *', [
        animate('2s', keyframes([
          style({ transform: 'translateY(0)', offset: 0 }),
          style({ transform: 'translateY(-20px)', offset: 0.5 }),
          style({ transform: 'translateY(0)', offset: 1 }),
        ])),
      ]),
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s ease-out', style({ opacity: 1 }))
      ])
    ])
  ],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
  suggestionLinks = [
    { path: '/products', label: 'Nos Produits' },
    { path: '/stylists', label: 'Nos Stylistes' },
  ];
  featuredProducts = [
    {
      id: 1,
      name: 'Produit Populaire 1',
      price: 49.99,
      image: '/assets/images/product-1.jpg'
    },
    {
      id: 2,
      name: 'Produit Populaire 2',
      price: 39.99,
      image: '/assets/images/product-2.jpg'
    },
    {
      id: 3,
      name: 'Produit Populaire 3',
      price: 59.99,
      image: '/assets/images/product-3.jpg'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // Animation initialization if needed
  }

  goBack() {
    this.router.navigate(['/']);
  }

  randomPosition(): number {
    return Math.random() * window.innerWidth;
  }
}
