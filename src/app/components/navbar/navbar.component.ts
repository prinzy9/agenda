import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToggleThemeComponent } from '../toggle-theme/toggle-theme.component';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { CalendarviewService } from '../../services/calendarview.service';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule, ToggleThemeComponent, CommonModule, MenuModule, ToastModule, ButtonModule, CalendarModule, BadgeModule, FormsModule],
  templateUrl: './navbar.component.html',
  providers: [DatePipe],
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] = [];
  giorni: MenuItem[] = [];
  utenti: MenuItem[] = [];
  date1: Date | undefined;
  oggi: string = new Date().toDateString();
  // currentIcon: string = '1';
  numeroDaVedere: number | null = 0;

  constructor(private calendarViewService: CalendarviewService, private datePipe: DatePipe) {
    // Usa DatePipe per formattare la data corrente come stringa
    this.oggi = this.datePipe.transform(new Date(), 'dd.MM.yyyy') || '';
  }
  // Cambia l'icona in base alla vista selezionata, versione 1
  // changeIcon(view: string) {
  //   switch (view) {
  //     case 'resourceTimelineDay':
  //       this.currentIcon = '1'; // Icona per oggi
  //       break;
  //     case 'customWeek':
  //       this.currentIcon = '7'; // Icona per settimana
  //       break;
  //     case 'customMonth':
  //       this.currentIcon = '31'; // Icona per mese
  //       break;
  //     default:
  //       this.currentIcon = ''; // Icona di default
  //   }
  // }

  changeCalendarView(view: string) {
    // this.changeIcon(view); // Cambia l'icona
    if (view === 'resourceTimelineDay') {
      this.numeroDaVedere = 1;
    } else if (view === 'customWeek') {
      this.numeroDaVedere = 7;
    } else if (view === 'customMonth') {
      this.numeroDaVedere = 31;
    }
    this.calendarViewService.changeView(view);  // Emetti il cambiamento di vista
  }
  ngOnInit() {

    this.utenti = [
      {
        label: 'Tutti',
        command: () => {
          this.calendarViewService.changeView('resourceTimelineDay');
        }
      },
      {
        label: 'ACG',
        command: () => {
          this.calendarViewService.changeView('resourceTimelineDay');
        }
      },
      {
        label: 'Amministrazione',
        command: () => {
          this.calendarViewService.changeView('resourceTimelineDay');
        }
      },
      {
        label: 'COGNOS BI MRO',
        command: () => {
          this.calendarViewService.changeView('resourceTimelineDay');
        }
      },
      {
        label: 'Progetti Speciali',
        command: () => {
          this.calendarViewService.changeView('resourceTimelineDay');
        }
      },
      {
        label: 'EDOC',
        command: () => {
          this.calendarViewService.changeView('resourceTimelineDay');
        }
      },
      {
        label: 'Infrastruttura',
        command: () => {
          this.calendarViewService.changeView('resourceTimelineDay');
        }
      },
      {
        label: 'SAP',
        command: () => {
          this.calendarViewService.changeView('resourceTimelineDay');
        }
      },
    ];

    this.giorni = [
      {
        label: 'Oggi',
        command: () => {
          this.changeCalendarView('resourceTimelineDay');
        }
      },
      {
        label: 'Settimana',
        command: () => {
          this.changeCalendarView('customWeek');
        }
      },
      {
        label: 'Mese',
        command: () => {
          this.changeCalendarView('customMonth');
        }
      },
    ];

    this.items = [
      {
        label: 'Elmi Calendar',
        icon: 'pi pi-home',
        route: '/Home',
      }
    ]
  }
  onDateSelect() {
    if (this.date1) {
      // Imposta l'ora della data a mezzogiorno (12:00) per evitare lo slittamento dovuto al fuso orario
      const selectedDate = new Date(this.date1);
      selectedDate.setHours(12, 0, 0, 0); // Imposta l'ora a 12:00:00
      // Invia la data con l'ora modificata
      this.calendarViewService.changeDate(selectedDate);
    }
  }
}
