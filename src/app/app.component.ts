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
import { timeInterval } from 'rxjs';
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

  }
  visible: boolean = false;
  bodyContent: string = '';
  title = 'Elmi Agenda';
  calendarOptions: CalendarOptions = {};


  constructor(private primengConfig: PrimeNGConfig, private http: HttpClient, private calendarView: CalendarviewService) {
    this.calendarOptions = {
      eventClick: (info) => {
        this.onClickEvent(info);
      },

      resourceAreaWidth: '25%',

      dayMaxEventRows: true,
      displayEventTime: false,
      eventOrderStrict: true,
      dayMaxEvents: 2,
      eventMaxStack: 1,
      eventDisplay: 'listItem',
      slotDuration: '24:00:00',

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
        startTime: '00:00', // a start time (09:00 in this example)
        endTime: '24:00' // an end time (18:00 in this example)

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
        left: 'prev,next resourceTimelineYear today',
        center: 'title',
        right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth'
      },
      plugins: [resourceTimelinePlugin], // Registra i plugin qui
      editable: true,
      selectable: true,
      views: {
        resourceTimelineFiveDays: {
          type: 'resourceTimeline',
          duration: { days: 5 },
        },

      },

      slotLabelFormat: [
        { weekday: 'long', day: 'numeric' },

      ],
      slotMinTime: '00:00:00',
      slotMaxTime: '23:00:00',

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
}



