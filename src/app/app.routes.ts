import { Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {LoginFormComponent} from './components/auth/login-form/login-form.component';
import {AuthGuard} from './@core/auth/auth.guard';
import {RegisterFormComponent} from './components/auth/register-form/register-form.component';
import {ProductsComponent} from './pages/products/products.component';
import {ProductDetailsComponent} from './components/products/product-details/product-details.component';
import {CollectionDetailsComponent} from './components/home/collection-details/collection-details.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { PaymentStatusComponent } from './pages/paymentStatus/payment-status.component';
import {StylistsComponent} from './pages/stylists/stylists.component';
import {StylistDetailsComponent} from './components/stylists/stylist-details/stylist-details.component';
import {CartComponent} from './pages/cart/cart.component';
import { ForgetPasswordComponent } from './components/auth/forget-password/forget-password.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component' ;
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {StylistAvailabilityComponent} from './components/stylists/stylist-availability/stylist-availability.component';
import {MeasureComponent} from './components/measure/measure.component';


const routeConfig: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page',
  },
  {
    path: 'login',
    component: LoginFormComponent,
    title: 'Connexion',
  },
  {
    path: 'register',
    component: RegisterFormComponent,
    title: 'Inscription',
  },
  {
    path: 'forget-password',
    component: ForgetPasswordComponent
  },
  {
    path: 'products',
    children: [
      {
        path: '',
        component: ProductsComponent,
        title: 'Nos Tenues'
      },
      {
        path: ':id',
        component: ProductDetailsComponent,
        title: 'Détails de la tenue'
      }
    ]
  },
  {
    path: 'collections/:id',
    component: CollectionDetailsComponent,
    title: "Details Collections"
  },
  {
    path: 'payment',
    component: PaymentComponent,
    title: "Formulaire de Paiement",
    canActivate: [AuthGuard],
  },
  {
    path: 'payment-status',
    component: PaymentStatusComponent,
    title : 'Confirmation de Paiement',
    canActivate: [AuthGuard],
  },
  {
    path: 'stylists',
    children: [
      {
        path: '',
        component: StylistsComponent,
        title: 'Nos Stylistes'
      },
      {
        path: ':id',
        component: StylistDetailsComponent,
        title: 'Détails du Styliste',
      }
    ]
  },
  {
    path: 'stylists/:id/availability',
    component: StylistAvailabilityComponent,
    title: 'Disponibilité du Styliste'
  },
  {
    path: 'cart',
    component: CartComponent,
    title : "Panier de commandes"
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title : "Dashboard",
    //canActivate: [AuthGuard],
  },
  {
    path: 'measures',
    component: MeasureComponent,
    title: "Mensurations",
    canActivate:[AuthGuard]
  },
  {
    path: '**',
    title: 'Page non trouvée',
    component: NotFoundComponent
  }
];
export default routeConfig;
