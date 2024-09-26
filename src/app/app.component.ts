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
import "primeicons/primeicons.css";
import Tooltip from 'tooltip.js'


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
  visible: boolean = false;
  bodyContent: string = '';
  title = 'Elmi Agenda';
  calendarOptions: CalendarOptions = {};
  hoveredEvent: any = null; // L'evento attualmente hoverato
  visibleTooltip: boolean = false; // Controlla la visibilità del tooltip
  visibleClickModal: boolean = false; // Controlla la visibilità del modal su click
  resources: any = [];
  events: any = [];
  tooltiptimeout: any;
  i: number = 0;


  ngOnInit() {
    this.calendarViewService.dateChange$.subscribe((date: Date) => {
      this.scrollToDate(date);
    });

    this.primengConfig.ripple = true;
    this.http.get('http://localhost:3000/resources').subscribe((resources) => {
      this.resources = resources;
      this.calendarOptions.resources = resources;
      console.log(this.resources)
    });

    this.http.get('http://localhost:3000/events').subscribe((events: any) => {
      this.events = events;
      this.calendarOptions.events = events;

      // this.calendarOptions.events = events.map((event: any) => {
      //   if (event.fascia == "am")
      //     event.title = 'mattina';
      //   else
      //     event.title = 'pomeriggio';
      //   return {
      //     id: event.id,
      //     resourceId: event.res_id,
      //     title: event.title,
      //     start: event.start,
      //     end: event.end,
      //     data: event.data,
      //     fascia: event.fascia
      //   };
      // });
    });

    this.calendarViewService.viewChange$.subscribe((view: any) => {
      this.changeView(view);
    });
    // Una volta che il calendario è inizializzato, scorri fino a oggi
    setTimeout(() => {
      this.scrollToToday();
    }, 100);  // Un piccolo ritardo per assicurarsi che il calendario sia pronto
  }
  constructor(private primengConfig: PrimeNGConfig, private http: HttpClient, private calendarViewService: CalendarviewService) {
    this.calendarOptions = {

      eventMouseEnter: (info) => {
        this.tooltiptimeout = setTimeout(() => {
          const tooltip = new Tooltip(info.el, {
            title: info.event.title,
            placement: 'bottom',
            trigger: 'hover',
            container: 'div'
          });
          tooltip.show();
        }, 1500);
      },
      eventMouseLeave: (info) => {
        clearTimeout(this.tooltiptimeout);
        const tooltips = document.querySelectorAll('.tooltip');
        tooltips.forEach(tooltips => tooltips.remove());
      },

      eventClick: (info) => {
        this.onClickEvent(info);
      },
      resourceAreaWidth: '27%',
      // initialDate: new Date(),
      // initialDate: '2022-01-01', //<= prova per vedere se cambia quanlcosa....


      // eventContent: function (arg) {
      //   const eventStart = new Date(arg.event.startStr);
      //   const hour = eventStart.getHours();

      //   if (hour < 12) {
      //     return ['Mattina']
      //   } else {
      //     return ['Pomeriggio']
      //   }
      // },

      contentHeight: 'auto',
      dayMaxEventRows: true,
      dayMaxEvents: 1,
      eventMaxStack: 1,
      eventDisplay: 'listItem',
      slotDuration: '24:00:00',
      scrollTime: '00:00:00',

      // resourceLaneContent: function (arg) {
      //   let italicEl = document.createElement('i')

      //   if (arg.resource) {
      //     italicEl.innerHTML = 'urgent event'
      //   } else {
      //     italicEl.innerHTML = 'normal event'
      //   }

      //   let arrayOfDomNodes = [italicEl]
      //   return { domNodes: arrayOfDomNodes }
      // },


      schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives', // licenza non commerciale per FullCalendar Scheduler
      timeZone: 'Europe/Rome',
      handleWindowResize: true,
      locale: itLocale, // seleziona la lingua Italiana
      aspectRatio: 2.5, // larghezza / altezza
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
          field: 'sede',
          headerContent: 'Sede',
          cellClassNames: 'interno',
          headerClassNames: 'interno',
          /**
           * Ritorna l'icona da visualizzare per ogni sede.
           * L'icona dipende dal valore di this.resources[this.i].sede.
           * Se il valore  "sede" allora viene visualizzata l'icona dell'utente,
           * se il valore  "SW" allora viene visualizzata l'icona del computer,
           * altrimenti viene visualizzata l'icona del blocco.
           * Inoltre, incrementa this.i di 1 e, se raggiunge la lunghezza di resources,
           * resetta this.i a 0.
           * @param {Object} s l'oggetto che rappresenta la riga della tabella.
           * @returns {Object} un oggetto con una propriet  html che rappresenta il contenuto della cella.
           */
          cellContent: (s) => {
            // console.log("sdfsf", this.i, s)
            const result = { html: '' };
            if (this.resources[this.i].sede == "sede") {
              result.html = '<i class="pi pi-user"></i>';
            } else if (this.resources[this.i].sede == "SW") {
              result.html = '<i class="pi pi-desktop"></i>';
            } else {
              result.html = '<i class="pi pi-ban"></i>';
            }
            this.i++;
            // resetta il counter se raggiunge la lunghezza di resources
            if (this.i >= this.resources.length) {
              this.i = 0;
            }
            return result;
          }
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
          cellClassNames: 'mobile',
          headerClassNames: 'mobile',
        }
      ],
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'prev,next'
      },
      viewDidMount: (args) => {
        // Aggiungi un listener sul pulsante "Oggi"
        setTimeout(() => {
          const todayButton = document.querySelector('.fc-today-button') as HTMLButtonElement;
          if (todayButton) {
            todayButton.addEventListener('click', () => {
              // Ricarica la pagina attuale
              window.location.reload(); // Simula un F5
            });
          }
        }, 1000);
      },
      plugins: [resourceTimelinePlugin], // plugin registrati
      editable: true,
      selectable: true,
      views: {
        customWeek: {
          type: 'resourceTimeline',  // Può essere qualsiasi tipo di visualizzazione
          duration: { days: 7 },      // Mostra 7 giorni
          // duration: { days: this.getFineAnnoAsDays(2) },  // Mostra i 31 giorni a partire dalla data corrente
          buttonText: 'Settimana',
          // initialDate: new Date(),
        },
        customMonth: {
          type: 'resourceTimeline',
          //  duration: { days: 31 },
          duration: { days: 31 },
          buttonText: 'Mese',
          // initialDate: this.getInizioAnno(),
          slotLabelFormat: [
            { weekday: 'long', day: 'numeric' },],
          initialView: "resourceTimelineMonth",
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
        }
      },
      slotLabelFormat: [
        { weekday: 'long', day: 'numeric' },
      ],
      slotMinTime: '00:00:00',
      slotMaxTime: '24:00:00',
    };
  }

  // Quando clicchi su un evento
  onClickEvent(info: any) {
    // this.bodyContent = info.event.title;
    const resourceId = info.event._def.extendedProps.res_id;
    const data = info.event._def.extendedProps.data;
    const fascia = info.event._def.extendedProps.fascia;

    const eventsFromIdRes = this.events.filter((event: any) =>
      ((event.res_id == resourceId) && (event.data == data) && (event.fascia == fascia))
    );

    console.log(eventsFromIdRes, this.events, info);
    // this.bodyContent = JSON.stringify(eventsFromIdRes);
    this.bodyContent += " " + info.event.title;
    this.bodyContent += " start at: " + info.event.startStr;
    this.bodyContent += " end at: " + info.event.endStr;
    this.visibleClickModal = true; // Mostra il modal
    this.visibleTooltip = false; // Nascondi il tooltip se era attivo
  }

  // Funzione per emettere il cambiamento di vista
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
  scrollToDate(date: Date) {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate(date);
  }
}



