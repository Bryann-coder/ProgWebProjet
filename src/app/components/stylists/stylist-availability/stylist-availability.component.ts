import {Component, OnInit} from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {Workday} from "../../../models/Workday";
import {WorkdaysService} from "../../../services/workdays/workdays.service";
import {AuthService} from "../../../services/auth/auth.service";
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'app-stylist-availability',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, RouterModule],
  templateUrl: './stylist-availability.component.html',
  styleUrls: ['./stylist-availability.component.css'],
})
export class StylistAvailabilityComponent implements OnInit {
  showModal = false;
  selectedDate: string = '';

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    selectable: true,
    editable: false,
    events: [],
    select: (info) => {
      const dateString = info.startStr;

      const isOccupied = (this.calendarOptions.events as any[]).some(
          (event: any) => event.start === dateString && event.extendedProps?.['status'] === 'busy'
      );

      if (!isOccupied) {
        this.openConfirmationModal(dateString);
      } else {
        this.toastr.warning('Ce jour est déjà réservé.');
      }
    },
    eventContent: (arg) => {
      const { event } = arg;
      const content = document.createElement('div');
      content.className = `p-2 rounded-lg ${
          event.extendedProps?.['status'] === 'available'
              ? 'bg-green-500 hover:bg-green-300 cursor-pointer'
              : 'bg-red-500 cursor-not-allowed'
      }`;

      const title = document.createElement('div');
      title.className = 'text-sm font-medium';
      title.innerText = event.title;
      content.appendChild(title);

      if (event.extendedProps?.['status'] === 'available') {
        content.addEventListener('click', (e) => {
          e.stopPropagation();
          if (event.start) {
            const selectedDate = new Date(event.start);
            selectedDate.setHours(8, 0, 0, 0);
            const formattedDateTime = this.formatDateTime(selectedDate);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate > today) {
              this.openConfirmationModal(formattedDateTime);
            } else {
              this.toastr.warning('Vous ne pouvez pas réserver une date passée.');
            }
          }
        });
      }

      return { domNodes: [content] };
    },
  };

  stylistId!: number;
  clientId!: number;
  isAuthenticated: boolean = false;
  isLoading: boolean = true;

  constructor(
      private stylistService: WorkdaysService,
      private route: ActivatedRoute,
      private router: Router,
      private http: HttpClient,
      private authService: AuthService,
      private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.isLoggedIn();
    if (!this.isAuthenticated) {
      return;
    }

    this.clientId = this.authService.getCurrentUser()?.id!;


    this.route.params.subscribe(params => {
      this.stylistId = +params['id'];
      if (!this.stylistId) {
        this.toastr.error('Erreur de chargement des disponibilités.');
        return;
      }

      this.loadWorkdays();
    });
  }

  openConfirmationModal(dateTime: string): void {
    this.selectedDate = dateTime;
    this.showModal = true;
  }

  confirmReservation(): void {
    this.reserveDay(this.stylistId, this.clientId, this.selectedDate);
    this.showModal = false;
  }

  cancelReservation(): void {
    this.showModal = false;
  }

  formatModalDate(): string {
    return new Date(this.selectedDate).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  loadWorkdays() {
    this.isLoading = true;
    this.stylistService.getWorkdaysByStylist(this.stylistId).subscribe({
      next: (data: Workday[]) => {
        const occupiedDays = new Set(data.map((event: Workday) =>
            new Date(event.date).toISOString().split('T')[0]
        ));

        const formattedEvents = this.generateEvents(occupiedDays);
        this.calendarOptions.events = formattedEvents;
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error('Erreur lors du chargement des disponibilités.');
        this.isLoading = false;
      }
    });
  }

  private generateEvents(occupiedDays: Set<string>): any[] {
    const formattedEvents = [];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split('T')[0];
      const isOccupied = occupiedDays.has(dateString);

      formattedEvents.push({
        title: isOccupied ? 'Occupé' : 'Libre',
        start: dateString,
        end: dateString,
        extendedProps: {
          status: isOccupied ? 'busy' : 'available'
        }
      });
    }

    return formattedEvents;
  }

  private formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day} 08:00:00`;
  }

  reserveDay(stylistId: number, userId: number, dateTime: string) {
    // Log pour débugger
    console.log('Données envoyées:', {
      stylist_id: stylistId,
      user_id: userId,
      date: dateTime,
    });

    // Vérifier que la date est au bon format
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) {
      this.toastr.error('Format de date invalide');
      return;
    }

    // S'assurer que les IDs sont des nombres
    if (!stylistId || !userId) {
      this.toastr.error('IDs invalides');
      return;
    }

    const payload = {
      stylist_id: stylistId,
      user_id: userId,
      date: dateTime,  // Format attendu: "YYYY-MM-DD HH:mm:ss"
    };

    // Ajouter des headers spécifiques si nécessaire
    const headers = {
      'Content-Type': 'application/json'
    };

    this.http.post('http://localhost:8000/api/workdays/request', payload, { headers }).subscribe({
      next: (response) => {
        console.log('Réponse:', response);  // Log la réponse pour débugger
        this.toastr.success('Réservation effectuée avec succès!');
        this.loadWorkdays();
      },
      error: (error) => {
        console.error('Erreur détaillée:', error);  // Log l'erreur complète
        let errorMessage = 'Erreur lors de la réservation.';

        // Si l'erreur contient un message spécifique du serveur
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }

        this.toastr.error(errorMessage);
      }
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
