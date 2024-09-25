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
  oggi: string = '';
  currentIcon: string = '1';


  constructor(private calendarViewService: CalendarviewService, private datePipe: DatePipe) {
    // Usa DatePipe per formattare la data corrente come stringa
    this.oggi = this.datePipe.transform(new Date(), 'dd.MM.yyyy') || '';
  }
  // Cambia l'icona in base alla vista selezionata
  changeIcon(view: string) {
    switch (view) {
      case 'resourceTimelineDay':
        this.currentIcon = '1'; // Icona per oggi
        break;
      case 'customWeek':
        this.currentIcon = '7'; // Icona per settimana
        break;
      case 'customMonth':
        this.currentIcon = '31'; // Icona per mese
        break;
      default:
        this.currentIcon = ''; // Icona di default
    }
  }

  changeCalendarView(view: string) {
    this.changeIcon(view); // Cambia l'icona
    this.calendarViewService.changeView(view);  // Emetti il cambiamento di vista
  }
  ngOnInit() {

    this.utenti = [
      {
        label: 'Seleziona:',
        items: [
          {
            label: 'Tutti',
            command: () => {
              this.changeCalendarView('resourceTimelineDay');
            }
          },
          {
            label: 'ACG',
            command: () => {
              this.changeCalendarView('resourceTimelineDay');
            }
          },
          {
            label: 'Amministrazione',
            command: () => {
              this.changeCalendarView('resourceTimelineDay');
            }
          },
          {
            label: 'COGNOS BI MRO',
            command: () => {
              this.changeCalendarView('resourceTimelineDay');
            }
          },
          {
            label: 'Progetti Speciali',
            command: () => {
              this.changeCalendarView('resourceTimelineDay');
            }
          },
          {
            label: 'EDOC',
            command: () => {
              this.changeCalendarView('resourceTimelineDay');
            }
          },
          {
            label: 'Infrastruttura',
            command: () => {
              this.changeCalendarView('resourceTimelineDay');
            }
          },
          {
            label: 'SAP',
            command: () => {
              this.changeCalendarView('resourceTimelineDay');
            }
          },

        ]

      }
    ],

      this.giorni = [
        {
          label: 'giorni:',
          items: [
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
          ]

        }
      ],

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
