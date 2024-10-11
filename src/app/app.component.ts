import { catchError, Subject, tap } from 'rxjs';
import { RequestsService } from './services/requests.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarModule } from 'primeng/calendar';
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
  events: any[] = [];
  tooltiptimeout: any;
  tooltiptimeout2: any;
  currentTooltip: HTMLElement | null = null;
  i: number = 0;
  resourceAreaWidth: string = '25%';
  users: any[] = [];






  ngOnInit() {
    this.loadEventsForResource();

    this.primengConfig.ripple = true;


    this.calendarViewService.dateChange$.subscribe((date: Date) => {
      this.scrollToDate(date);
    });



    this.primengConfig.ripple = true;
    this.requestsService.getResources();
    this.requestsService.resources$.subscribe((data: any[]) => {
      this.resources = data;
      this.calendarOptions.resources = data;
      this.users = data;
    })

    this.calendarViewService.viewChange$.subscribe((view: any) => {
      this.changeView(view);
    });
    setTimeout(() => {
      this.scrollToToday();
    }, 100);

    // Filtra le risorse in base alla ricerca utente
    this.calendarViewService.search$.subscribe((query) => {
      this.filterResources(query);
    });


  }
  constructor(private primengConfig: PrimeNGConfig, private http: HttpClient, private calendarViewService: CalendarviewService, private requestsService: RequestsService) {
    this.calendarOptions = {

      // eventContent: function (arg) {
      //   return { html: arg.event.title };  // Visualizza il titolo degli eventi
      // },
      // events: this.events,


      // metodo per aggiungere un tooltip personalizzato alle risorse //
      resourceLabelDidMount: (info) => {
        info.el.addEventListener('mouseenter', () => {
          this.showTooltip(info.resource.extendedProps['fname'], info.resource.extendedProps['email'], info.el);
        });

        info.el.addEventListener('mouseleave', () => {
          this.hideTooltip();
        });
      },
      datesSet: () => {
        // Eventuali altri aggiornamenti legati alla vista
      },
      // fine metodo per aggiungere un tooltip personalizzato alle risorse //
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
      resourceAreaWidth: this.resourceAreaWidth,
      stickyHeaderDates: 'auto',
      expandRows: true,
      contentHeight: 'auto',
      dayMaxEventRows: true,
      dayMaxEvents: 1,
      eventMaxStack: 1,
      eventDisplay: 'listItem',
      handleWindowResize: true,
      slotDuration: '24:00:00',
      scrollTime: '00:00:00',
      schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives', // licenza non commerciale per FullCalendar Scheduler
      timeZone: 'Europe/Rome',
      locale: itLocale, // seleziona la lingua Italiana
      aspectRatio: 9.16, // larghezza / altezza
      initialView: 'customWeek', // vista iniziale
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
          cellClassNames: 'dipendenti',
          headerClassNames: 'dipendenti',
        },
        {
          field: 'sede',
          headerContent: 'Sede',
          cellClassNames: 'sede',
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
              result.html = '';
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
        left: 'today',
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
          type: 'resourceTimeline',
          duration: { days: 7 },
          buttonText: 'Settimana',
        },
        customMonth: {
          type: 'resourceTimeline',
          duration: { days: 31 },
          buttonText: 'Mese',

          slotLabelFormat: [
            { weekday: 'long', day: 'numeric' },],
          initialView: "resourceTimelineMonth",
        },
        resourceTimelineFiveDays: {
          type: 'resourceTimeline',
          duration: { days: 5 },
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

    const resourceId = info.event._def.extendedProps.res_id;
    const data = info.event._def.extendedProps.data;

    const eventsFromIdRes = this.events.filter((event: any) =>
      ((event.res_id == resourceId) && (event.data == data))
    );
    this.bodyContent = "";
    this.bodyContent = info.event.title;
    // this.bodyContent += " start at: " + info.event.startStr;
    // this.bodyContent += " end at: " + info.event.endStr;
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

  scrollToDate(date: Date) {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate(date);
  }

  // Funzione per mostrare il Modal su risorsa //
  showTooltip(resourceName: string, resourceEmail: string, element: HTMLElement) {
    this.tooltiptimeout2 = setTimeout(() => {
      const tooltip = document.createElement('div');
      tooltip.className = 'custom-tooltip';
      tooltip.innerHTML = `<strong>Nome:</strong> ${resourceName}<br><strong>Email:</strong> ${resourceEmail}`;

      const rect = element.getBoundingClientRect();
      tooltip.style.top = `${rect.bottom + window.scrollY - 10}px`;
      tooltip.style.left = `${rect.left + window.scrollX + rect.width / 1000}px`;

      document.body.appendChild(tooltip);
      this.currentTooltip = tooltip;

    }, 500);

  }

  // Funzione per nascondere il tooltip
  hideTooltip() {
    clearTimeout(this.tooltiptimeout2);
    if (this.currentTooltip) {
      document.body.removeChild(this.currentTooltip);
      this.currentTooltip = null;
    }
  }

  filterResources(query: string) {
    // Filtra le risorse in base alla query di ricerca
    if (query) {
      this.calendarOptions.resources = this.resources.filter((resource: any) =>
        resource.fname.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      // Se non c'è nessuna query, visualizza tutte le risorse
      this.calendarOptions.resources = this.resources;
    }

    // Controlla se calendarComponent è inizializzato prima di chiamare getApi()
    if (this.calendarComponent && this.calendarComponent.getApi()) {
      // Aggiorna la vista del calendario
      this.calendarComponent.getApi().refetchResources();
    } else {
      console.error('calendarComponent non è ancora pronto');
    }
  }
  onAreaSelected(area: string) {
    // Filtra gli utenti in base all'area selezionata
    if (area) {
      this.requestsService.getUsersByArea(area).subscribe((filteredUsers) => {
        this.users = filteredUsers;
        this.calendarOptions.resources = filteredUsers;
      });
    } else {
      // Se non c'è filtro, mostra tutti gli utenti
      this.requestsService.resources$.subscribe((data) => {
        this.users = data;
        this.calendarOptions.resources = data;
      });
    }
  }
  loadEventsForResource() {
    // Svuota la lista corrente degli eventi prima di aggiungere i nuovi
    this.calendarOptions.events = [];
    // Chiama il service per recuperare gli eventi
    this.requestsService.getEvents().pipe(
      tap((events: any[]) => {
        this.events = events;  // Assegna gli eventi ottenuti
        this.calendarOptions.events = this.events;  // Aggiorna gli eventi del calendario
      }),
      catchError((error: any) => {
        console.error('Errore nel caricamento degli eventi', error);
        return [];  // Ritorna un array vuoto in caso di errore
      })
    ).subscribe();
    // return { unsubscribe() { } };
  }

}

