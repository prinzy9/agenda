import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule, ToggleThemeComponent, CommonModule, MenuModule, ToastModule, ButtonModule, CalendarModule, BadgeModule, FormsModule, InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: './navbar.component.html',
  providers: [DatePipe],
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  @Output() areaSelected = new EventEmitter<string>();
  items: MenuItem[] = [];
  giorni: MenuItem[] = [];
  utenti: MenuItem[] = [];
  date1: Date | undefined;
  oggi: string = new Date().toDateString();
  numeroDaVedere: number | null = 0;
  searchQuery: string = '';

  constructor(private calendarViewService: CalendarviewService, private datePipe: DatePipe) {
    // Usa DatePipe per formattare la data corrente come stringa
    this.oggi = this.datePipe.transform(new Date(), 'dd.MM.yyyy') || '';
  }
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
          this.selectArea(''); // Se non c'è filtro, passa una stringa vuota
        },
      },
      {
        label: 'AS/400, ACG, Sintesi',
        command: () => {
          this.selectArea('ACG');
        },
      },
      {
        label: 'Amministrazione',
        command: () => {
          this.selectArea('AMM');
        },
      },
      {
        label: 'Consulenza BI MRO',
        command: () => {
          this.selectArea('CONSUL');
        },
      },
      {
        label: 'eDoc',
        command: () => {
          this.selectArea('EDOC');
        },
      },
      {
        label: 'Infrastruttura',
        command: () => {
          this.selectArea('INFRA');
        },
      },
      {
        label: 'Progetti Speciali',
        command: () => {
          this.selectArea('PRGSW');
        },
      },
      {
        label: 'SAP',
        command: () => {
          this.selectArea('SAP');
        },
      },
    ];

    this.giorni = [
      {
        label: 'Giorno',
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
  searchUser(event: any) {
    const query = event.target.value;  // Prendi il valore dell'input
    this.calendarViewService.updateSearch(query);  // Passa la query al service
  }
  // Emetti l'area selezionata
  selectArea(value: string) {
    this.areaSelected.emit(value);
  }
}
