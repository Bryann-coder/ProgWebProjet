import { Component, OnInit } from '@angular/core';
import {Measure} from '../../models/measure';
import {finalize} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {BodyMeasurementsService} from '../../services/measures/body-measurements.service';
import {AuthService} from '../../services/auth/auth.service';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { Router } from '@angular/router';
type MeasureKey = keyof Omit<Measure, 'id' | 'user_id'>;


@Component({
  selector: 'app-measure',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './measure.component.html',
  styleUrl: './measure.component.css'
})
export class MeasureComponent implements OnInit{
  error: string = '';
  isUploading: boolean = false;
  uploadError: string | null = null;
  uploadedImage: string | null = null;
  measurementMethod: 'form' | 'image' = 'form';

  mensurations: Measure = {
    id: 0,
    user_id: 0,
    type: 0,
    tour_de_la_poitrine: 0,
    tour_de_taille: 0,
    tour_de_bassin: 0,
    longueur_du_buste: 0,
    tour_de_la_cuisse: 0,
    tour_du_mollet: 0,
    longueur_entre_jambes: 0,
    largeur_epaule: 0,
    tour_de_cou: 0,
    tour_de_bras: 0,
    tour_avant_bras: 0,
    longueur_du_bras: 0,
    tour_de_poignet: 0,
  };

  mensurationFields = [
    {
      key: 'tour_de_la_poitrine' as MeasureKey,
      label: 'Tour de la poitrine',
      required: true,
    },
    {
      key: 'tour_de_taille' as MeasureKey,
      label: 'Tour de taille',
      required: true,
    },
    {
      key: 'tour_de_bassin' as MeasureKey,
      label: 'Tour de bassin',
      required: true,
    },
    {
      key: 'longueur_du_buste' as MeasureKey,
      label: 'Longueur du buste',
      required: true,
    },
    {
      key: 'tour_de_la_cuisse' as MeasureKey,
      label: 'Tour de la cuisse',
      required: true,
    },
    {
      key: 'tour_du_mollet' as MeasureKey,
      label: 'Tour du mollet',
      required: true,
    },
    {
      key: 'longueur_entre_jambes' as MeasureKey,
      label: 'Longueur entre-jambes',
      required: true,
    },
    {
      key: 'largeur_epaule' as MeasureKey,
      label: 'Largeur épaule',
      required: true,
    },
    { key: 'tour_de_cou' as MeasureKey, label: 'Tour de cou', required: true },
    {
      key: 'tour_de_bras' as MeasureKey,
      label: 'Tour de bras',
      required: true,
    },
    {
      key: 'tour_avant_bras' as MeasureKey,
      label: 'Tour avant-bras',
      required: true,
    },
    {
      key: 'longueur_du_bras' as MeasureKey,
      label: 'Longueur du bras',
      required: true,
    },
    {
      key: 'tour_de_poignet' as MeasureKey,
      label: 'Tour de poignet',
      required: false,
    },
  ] as const;

  currentUrl: string = '';
  type: number = 0;

  constructor(private router: Router, private toastr:ToastrService, private measurementsService: BodyMeasurementsService, private userService: AuthService) {
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    if(this.currentUrl !== "/measures"){
      this.type = 1;
    }else{
      this.type = 0;
    }
    console.log(this.type);
    console.log(this.currentUrl);
  }

  getMensurationValue(key: MeasureKey): string {
    return this.mensurations[key].toString() || '0';
  }

  setMensurationValue(key: MeasureKey, value: string): void {
    if (key in this.mensurations) {
      this.mensurations[key] = parseInt(value);
    }
  }

  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      const file = input.files[0];

      // Validation du fichier
      if (file.size > 10 * 1024 * 1024) {
        this.uploadError = 'Le fichier ne doit pas dépasser 10MB.';
        this.isUploading = false;
        return;
      } else if (!['image/png', 'image/jpeg'].includes(file.type)) {
        this.uploadError = 'Seuls les formats PNG et JPG sont acceptés.';
        this.isUploading = false;
        return;
      }

      // Réinitialisation des erreurs
      this.uploadError = null;
      this.isUploading = true;

      this.extractMeasurementsFromImage(file);
      // Lecture du fichier
      const reader = new FileReader();
      reader.onload = () => {
        this.uploadedImage = reader.result as string;
        this.isUploading = false;
      };
      reader.onerror = () => {
        this.uploadError = 'Une erreur est survenue lors du téléchargement.';
        this.isUploading = false;
      };

      reader.readAsDataURL(file);
    }
  }

  extractMeasurementsFromImage(imageFile: File): void {
    this.isUploading = true;

    this.measurementsService
      .extractMeasurements(imageFile)
      .pipe(
        finalize(() => {
          this.isUploading = false; // Assurez-vous que le statut d'upload est mis à jour
        })
      )
      .subscribe({
        next: (data) => {
          // Validation stricte des clés et mise à jour des mesures
          Object.keys(data).forEach((key) => {
            if (key in this.mensurations) {
              this.mensurations[key as MeasureKey] =
                (data as Partial<Measure>)[key as MeasureKey] || 0;
            }
          });
          console.log('Mesures extraites avec succès:', this.mensurations);
        },
        error: (err) => {
          this.uploadError =
            'Une erreur est survenue lors de l’extraction des mesures.';
          console.error('Erreur:', err);
          // Affiche une notification utilisateur
          this.toastr.error(
            'Erreur lors de l’extraction des mesures. Veuillez réessayer.',
            'Erreur'
          );
        },
      });
  }

  validateMensurations(): boolean {
    if (this.measurementMethod === 'image' && this.uploadedImage) {
      return true;
    }

    const requiredFields = this.mensurationFields.filter(
      (field) => field.required
    );
    return requiredFields.every((field) => {
      const value = this.mensurations[field.key];
      return value !== undefined && value !== 0;
    });
  }

  saveMensurations(): void {
    if (!this.validateMensurations()) {
      this.error =
        'Veuillez remplir toutes les mesures requises ou uploader une image';
      return;
    }

    if (
      this.mensurationFields.some(
        (field) => field.required && !this.getMensurationValue(field.key)
      )
    ) {
      this.error = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    const user = this.userService.getCurrentUser();
    if (!user) {
      this.toastr.error(
        'Vous devez être connecté pour enregistrer les mesures.',
        'Erreur'
      );
      return;
    }

    // @ts-ignore
    const measurements = {
      ...this.mensurations,
      user_id: user.id,
      type: this.type
    };

    this.userService.saveMeasurements(measurements).subscribe({
      next: (response) => {
        console.log('Mesures sauvegardées avec succès:', response);
        if(this.type === 0){
          const user_measures: string|null = localStorage.getItem('user_measures');
          let parsed: Measure[] = user_measures? JSON.parse(user_measures):[]
          parsed.push(response);
          localStorage.setItem('user_measures',JSON.stringify(parsed));
          localStorage.setItem("mesures_for","user");
        }else{
          localStorage.setItem("mesures",JSON.stringify(response));
          localStorage.setItem("mesures_for",this.currentUrl);
        }
        this.error = '';
        this.toastr.success(
          'Vos mesures ont été sauvegardées avec succès !',
          'Succès'
        );
      },
      error: (err) => {
        console.error('Erreur lors de la sauvegarde des mesures:', err);
        this.error =
          'Une erreur est survenue lors de la sauvegarde des mesures.';
        this.toastr.error(
          'Impossible de sauvegarder les mesures. Veuillez réessayer.',
          'Erreur'
        );
      },
    });
  }
}
