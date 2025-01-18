import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { ImageService } from '../../services/image/image.service';
import { User } from '../../models/User';
import { Order } from '../../models/order';
import { Product } from '../../models/Product';
import { Review } from '../../models/Review';
import { ToastrService } from 'ngx-toastr';
import { StylistsService } from '../../services/stylists/stylists.service';
import { environment } from '../../@core/environnment';
import { Router } from '@angular/router';
import { PageRefreshService } from '../../services/refresh/page-refresh.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, FormsModule],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  private imageUrl = environment.imageUrl;

  stylisteId: any = null;
  activeTab = 'commandes';
  commandes: Order[] = [];
  produits: Product[] = [];
  reviews: Map<number, Review[]> = new Map();
  selectedProduct: Product = {
    id: 0,
    stylist_id: 0,
    nom: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    sizes: [],
    stylist: undefined,
    reviews: [],
    created_at: new Date()
  };
  showModal: boolean = false;
  user: User | null = null;
  isAuthenticated = false;
  isLoading = true; // Ajout de l'état de chargement
  nameOfPopup: string = "Modifier le Produit";
  modifyOrCreate: boolean = false;
  isSaved: boolean = false;

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private authService: AuthService,
    private toastr: ToastrService,
    private stylistService: StylistsService,
    private imageService: ImageService,
    private pageRefreshService: PageRefreshService
  ) {}

  styliste: any = {
    id: 0,
    user_id: 0,
    biographie: '',
    specialite: '',
    rating: 0,
    photo: null,
    nom: '',
    email: '',
    created_at: '',
    updated_at: '',
  };

  editMode: any = {
    nom: false,
    email: false,
    biographie: false,
    specialite: false,
    photo: false
  };

  ngOnInit() {
    this.loadData();
    this.user = this.authService.getCurrentUser();
    this.loadStylisteFromStorage();
  }

  ngAfterViewInit() {
    if (this.fileInput) {
      this.fileInput.nativeElement.addEventListener('change', this.onFileChange.bind(this));
    }
  }

  editField(field: string): void {
    this.editMode[field] = !this.editMode[field];
  }

  loadStylisteFromStorage() {
    const savedStyliste = localStorage.getItem('stylist');
    if (savedStyliste) {
      const parsedStyliste = JSON.parse(savedStyliste);
      this.styliste = {
        id: parsedStyliste.id,
        user_id: parsedStyliste.user_id,
        biographie: parsedStyliste.bibliography || '',
        specialite: parsedStyliste.specialite || '',
        rating: parsedStyliste.rating || 0,
        photo: parsedStyliste.image ? this.imageService.getImageUrl(parsedStyliste.image) : null,
        nom: parsedStyliste.user?.nom || '',
        email: parsedStyliste.user?.email || '',
        created_at: parsedStyliste.created_at,
        updated_at: parsedStyliste.updated_at,
      };
    }

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      this.styliste.user_id = parsedUser.id;
    }
  }

  async onFileChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files[0]) {
      const file = input.files[0];
      try {
        const base64Image = await this.convertFileToBase64(file);

        // Handle profile photo
        if (this.editMode.photo) {
          this.styliste.photo = base64Image;
          await this.updateProfilePhoto(base64Image);
        }
        // Handle product photo
        else if (this.selectedProduct) {
          this.selectedProduct.image = base64Image;
        }
      } catch (error) {
        console.error('Error processing image:', error);
        this.toastr.error('Erreur lors du traitement de l\'image');
      }
    }
  }

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('FileReader did not return a string'));
        }
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  private async updateProfilePhoto(base64Image: string): Promise<void> {
    const updatedData = {
      bibliography: this.styliste.biographie,
      specialite: this.styliste.specialite,
      rating: this.styliste.rating,
      image: base64Image,
      user_id: this.styliste.user_id,
      user: {
        id: this.styliste.user_id,
        nom: this.styliste.nom,
        email: this.styliste.email
      }
    };

    try {
      const response = await this.stylistService.updateStylisteProfil(this.styliste.id, updatedData).toPromise();
      // Update localStorage with the URL returned from backend
      const currentData = JSON.parse(localStorage.getItem('stylist') || '{}');
      const updatedStyliste = {
        ...currentData,
        image: response.image
      };
      localStorage.setItem('stylist', JSON.stringify(updatedStyliste));

      // Update UI with the full image URL
      this.styliste.photo = this.imageService.getImageUrl(response.image);
      this.editMode.photo = false;
      this.toastr.success('Photo de profil mise à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la photo:', error);
      this.toastr.error('Erreur lors de la mise à jour de la photo');
    }
  }

  saveProfile() {
    if (!this.validateProfile(this.styliste)) {
      this.toastr.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // Check if we're updating the photo
    const isUpdatingPhoto = this.editMode.photo && this.styliste.photo && this.styliste.photo.startsWith('data:image');

    const updatedData = {
      bibliography: this.styliste.biographie,
      specialite: this.styliste.specialite,
      rating: this.styliste.rating,
      image: isUpdatingPhoto ? this.styliste.photo : undefined,
      user_id: this.styliste.user_id,
      user: {
        id: this.styliste.user_id,
        nom: this.styliste.nom,
        email: this.styliste.email
      }
    };

    this.stylistService.updateStylisteProfil(this.styliste.id, updatedData).subscribe({
      next: (response) => {
        const currentStylistData = JSON.parse(localStorage.getItem('stylist') || '{}');
        const currentUserData = JSON.parse(localStorage.getItem('user') || '{}');

        const updatedStyliste = {
          ...currentStylistData,
          bibliography: this.styliste.biographie,
          specialite: this.styliste.specialite,
          image: isUpdatingPhoto ? response.image : currentStylistData.image,
          user_id: this.styliste.user_id,
          user: {
            ...currentStylistData.user,
            nom: this.styliste.nom,
            email: this.styliste.email
          }
        };

        const updatedUser = {
          ...currentUserData,
          nom: this.styliste.nom,
          email: this.styliste.email
        };

        localStorage.setItem('stylist', JSON.stringify(updatedStyliste));
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // Update photo URL if image was updated
        if (isUpdatingPhoto) {
          this.styliste.photo = this.imageService.getImageUrl(response.image);
        }

        Object.keys(this.editMode).forEach(key => this.editMode[key] = false);

        this.toastr.success('Profil mis à jour avec succès');
        this.isSaved = true;
        setTimeout(() => this.isSaved = false, 3000);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
        this.toastr.error('Erreur lors de la mise à jour du profil');
      }
    });
  }

  validateProfile(styliste: any): boolean {
    return styliste.nom && styliste.email && styliste.biographie && styliste.specialite;
  }

  loadData() {
    this.isAuthenticated = this.authService.isLoggedIn();
    if (this.isAuthenticated) {
      this.user = this.authService.getCurrentUser();
      if (this.user?.role === 'stylist') {
        const stylist = this.stylistService.getConnectedStylist();
        if (stylist) {
          this.stylisteId = stylist.id;
        } else {
          console.warn('No connected stylist found.');
        }
      }
    }

    this.dashboardService.getCommandes(this.stylisteId).subscribe(
      commandes => {
        this.commandes = commandes;
        this.isLoading = false; // Mettre à jour l'état de chargement
      },
      error => {
        console.error('Error loading commands:', error);
        this.isLoading = false; // Mettre à jour l'état de chargement
      }
    );

    this.dashboardService.getProduits(this.stylisteId).subscribe(
      produits => {
        this.produits = produits;
        produits.forEach(produit => {
          this.loadReviews(produit.id);
        });
      }
    );
  }

  loadReviews(produitId: number) {
    this.dashboardService.getReviews(produitId).subscribe(
      reviews => this.reviews.set(produitId, reviews)
    );
  }

  getReviewsForProduit(produitId: number): Review[] {
    return this.reviews.get(produitId) || [];
  }

  async updateStatut(orderId: number, newStatus: 'confirmed' | 'shipped' | 'delivered' | 'cancelled') {
    try {
      const commande = this.commandes.find(c => c.id === orderId);
      if (!commande) {
        throw new Error('Commande non trouvée');
      }

      const orderData = {
        user_id: commande.cart.user_id,
        product_id: commande.product_id,
        prix: commande.prix,
        status: newStatus
      };

      this.dashboardService.updateOrder(orderId, orderData)
        .subscribe({
          next: (response) => {
            commande.status = newStatus;

            let message = '';
            switch (newStatus) {
              case 'confirmed':
                message = 'Commande acceptée avec succès';
                break;
              case 'shipped':
                message = 'Commande expédiée avec succès';
                break;
              case 'delivered':
                message = 'Commande marquée comme livrée';
                break;
              case 'cancelled':
                message = 'Commande annulée';
                break;
            }

            this.toastr.success(message, "Réussite de l'opération")
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour:', error);
          }
        });
    } catch (error) {
      console.error('Erreur:', error);
    }
  }

  editProduit(produit: any) {
    this.selectedProduct = { ...produit };
    this.showModal = true;
    this.nameOfPopup = "Modifier le Produit";
    this.modifyOrCreate = false;
  }

  saveProduit() {
    if (!this.selectedProduct || !this.selectedProduct.id) {
      console.error("Produit invalide ou ID manquant");
      return;
    }

    const productData = {
      stylist_id: this.selectedProduct.stylist_id,
      nom: this.selectedProduct.nom,
      description: this.selectedProduct.description,
      price: this.selectedProduct.price,
      category: this.selectedProduct.category,
      image: this.selectedProduct.image
    };

    this.dashboardService.updateProduct(this.selectedProduct.id, productData).subscribe(
      (response) => {
        const index = this.produits.findIndex(p => p.id === this.selectedProduct.id);
        if (index !== -1) {
          this.produits[index] = { ...this.selectedProduct };
        }
        this.showModal = false;
        this.toastr.success('Produit mis à jour avec succès');
      },
      (error) => {
        console.error("Erreur lors de la mise à jour du produit :", error);
        this.toastr.error('Erreur lors de la mise à jour du produit');
      }
    );
  }

  closeModal() {
    this.showModal = false;
    this.selectedProduct = {
      id: 0,
      stylist_id: 0,
      nom: '',
      description: '',
      price: 0,
      category: '',
      image: '',
      sizes: [],
      stylist: undefined,
      reviews: [],
      created_at: new Date()
    };
  }

  addProduit() {
    this.showModal = true;
    this.nameOfPopup = "Ajouter un produit";
    this.modifyOrCreate = true;
  }

  ajouterProduit() {
    const productData = {
      stylist_id: this.stylisteId,
      nom: this.selectedProduct.nom,
      description: this.selectedProduct.description,
      price: this.selectedProduct.price,
      category: this.selectedProduct.category,
      image: this.selectedProduct.image
    };

    this.dashboardService.addProduct(productData).subscribe(
      (response) => {
        this.toastr.success('Produit ajouté avec succès');
        this.showModal = false;
        this.loadData(); // Recharger la liste des produits
      },
      (error) => {
        console.error("Erreur lors de l'ajout du produit :", error);
        this.toastr.error('Erreur lors de l\'ajout du produit');
      }
    );
  }

  photoProfil(photoUrl: string): string {
    if (!photoUrl || photoUrl.trim() === `${this.imageUrl}/null`) {
      return '/assets/defaultProfil.png';
    }
    return photoUrl;
  }

  deleteProduit(productId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.dashboardService.deleteProduct(productId).subscribe({
        next: () => {
          this.produits = this.produits.filter(p => p.id !== productId);
          this.toastr.success('Produit supprimé avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.toastr.error('Erreur lors de la suppression du produit');
        }
      });
    }
  }

  revokeStylist() {
    if (confirm('Êtes-vous sûr de vouloir ne plus être styliste ? Cette action est irréversible.')) {
      this.stylistService.revokeStylist(this.stylisteId).subscribe({
        next: () => {
          localStorage.removeItem('stylist');
          if (this.user) {
            this.user.role = 'user';
            localStorage.setItem('user', JSON.stringify(this.user));
          }
          this.router.navigate(['/']);
          this.toastr.success('Vous n\'êtes plus styliste');
          this.pageRefreshService.refreshPage();

        },
        error: (error) => {
          console.error('Erreur lors de la révocation:', error);
          this.toastr.error('Erreur lors de la révocation du statut de styliste');
        }
      });
    }
  }
}
