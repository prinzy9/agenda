import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular'; // FullCalendar
import { CalendarModule } from 'primeng/calendar'; // PrimeNG Calendar
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import itLocale from '@fullcalendar/core/locales/it';
import { CalendarOptions } from '@fullcalendar/core';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { PrimeNGConfig } from 'primeng/api';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { CalendarviewService } from './services/calendarview.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FullCalendarModule, CalendarModule, DialogModule, CommonModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  @ViewChild('calendar')
  calendarComponent!: FullCalendarComponent;


  ngOnInit() {

    this.primengConfig.ripple = true;
    this.http.get('http://localhost:3000/resources').subscribe((resources) => {
      this.calendarOptions.resources = resources;
    });

    this.http.get('http://localhost:3000/events').subscribe((events) => {
      this.calendarOptions.events = events;
    });

    this.calendarViewService.viewChange$.subscribe((view: any) => {
      this.changeView(view);
    });

    // Una volta che il calendario è inizializzato, scorri fino a oggi
    setTimeout(() => {
      this.scrollToToday();
    }, 100);  // Un piccolo ritardo per assicurarsi che il calendario sia pronto

  }
  visible: boolean = false;
  bodyContent: string = '';
  title = 'Elmi Agenda';
  calendarOptions: CalendarOptions = {};


  constructor(private primengConfig: PrimeNGConfig, private http: HttpClient, private calendarViewService: CalendarviewService) {
    this.calendarOptions = {
      eventClick: (info) => {
        this.onClickEvent(info);
      },

      resourceAreaWidth: '25%',

      // initialDate: new Date(),
      // initialDate: '2022-01-01', //<= prova per vedere se cambia quanlcosa....
      nowIndicator: true,
      dayMaxEventRows: true,
      displayEventTime: false,
      eventOrderStrict: true,
      dayMaxEvents: 2,
      eventMaxStack: 1,
      eventDisplay: 'listItem',
      slotDuration: '24:00:00',
      scrollTime: '00:00:00',

      schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives', // licenza non commerciale per FullCalendar Scheduler
      timeZone: 'Europe/Rome',
      handleWindowResize: true,
      contentHeight: '85vh',
      locale: itLocale, // seleziona la lingua Italiana
      aspectRatio: 2, // larghezza / altezza
      initialView: 'resourceTimelineDay', // vista iniziale
      businessHours: {
        // days of week. an array of zero-based day of week integers (0=Sunday)
        daysOfWeek: [1, 2, 3, 4, 5], // Lunedì - Venerdì
        startTime: '00:00', // 
        endTime: '24:00' // 

      },
      resourceAreaColumns: [
        {
          field: 'fname',
          headerContent: 'Dipendenti',

        },
        {
          field: 'iname',
          headerClassNames: 'interno',
          cellClassNames: 'interno',
          headerContent: 'Int.'
        },
        {
          field: 'imobile',
          headerContent: 'Mobile',

        }
      ],

      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'customYear'
      },
      plugins: [resourceTimelinePlugin], // plugin registrati
      editable: true,
      selectable: true,
      views: {

        customWeek: {
          type: 'resourceTimeline',  // Può essere qualsiasi tipo di visualizzazione
          //  duration: { days: 7 },
          duration: { days: this.getFineAnnoAsDays(2) },  // Mostra i 31 giorni a partire dalla data corrente
          buttonText: 'Settimana',
          // initialDate: new Date(),
        },

        customMonth: {
          type: 'resourceTimeline',
          //  duration: { days: 31 },
          duration: { days: this.getFineAnnoAsDays(2) },
          buttonText: 'Mese',
          // initialDate: this.getInizioAnno(),
          slotLabelFormat: [
            { weekday: 'short', day: 'numeric' },]

        },
        customYear: {
          // initialDate: new Date(),
          type: 'resourceTimeline',  // Può essere resourceTimeline o il tipo di visualizzazione che preferisci
          duration: { years: 1 },    // Mostra un anno intero
          buttonText: 'Anno',
          initialDate: this.getInizioAnno(),       // Testo del pulsante per la vista annuale
        },

        resourceTimelineFiveDays: {
          type: 'resourceTimeline',
          duration: { days: 5 },
          // initialDate: new Date(),
        },

      },

      slotLabelFormat: [
        { weekday: 'long', day: 'numeric' },

      ],
      slotMinTime: '00:00:00',
      slotMaxTime: '24:00:00',

    };

  }

  // gestione dell'eventuale click su un evento
  onClickEvent(info: any) {
    this.bodyContent = info.event.title;
    this.visible = true;
  }

  changeView(view: string) {
    let calendarApi = this.calendarComponent.getApi(); // Ottieni l'API del calendario
    calendarApi.changeView(view);
  }

  // Funzione per spostare la vista del calendario sulla data di oggi
  scrollToToday() {
    const calendarApi = this.calendarComponent.getApi(); // Ottieni l'API del calendario
    const today = new Date();

    // Imposta lo scroll sulla data di oggi
    calendarApi.gotoDate(today);
  }

  getInizioAnno() {
    // Ottieni la data di oggi
    const oggi = new Date();

    // Ottieni l'anno corrente
    const annoCorrente = oggi.getFullYear();

    // Crea una nuova data per il 1º gennaio dell'anno corrente
    const primoGennaio = new Date(annoCorrente, 0, 1);
    return primoGennaio;
  }

  getFineAnno(n: number) {
    const fine = this.getInizioAnno();
    fine.setFullYear(fine.getFullYear() + n);
    return fine;
  }
  getFineAnnoAsDays(n: number) {
    const diff = this.getFineAnno(n).getTime() - this.getInizioAnno().getTime();
    const msDay = 1000 * 60 * 60 * 24; // Millisecondi in un giorno
    return Math.floor(diff / msDay);
  }
}



