import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular'; // FullCalendar
import { CalendarModule } from 'primeng/calendar'; // PrimeNG Calendar
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import itLocale from '@fullcalendar/core/locales/it';
import { CalendarOptions } from '@fullcalendar/core';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { PrimeNGConfig } from 'primeng/api';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FullCalendarModule, CalendarModule, DialogModule, CommonModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  ngOnInit() {
    this.primengConfig.ripple = true;
  }
  visible: boolean = false;
  bodyContent: string = '';
  title = 'Elmi Agenda';
  calendarOptions: CalendarOptions = {};


  constructor(private primengConfig: PrimeNGConfig) {
    this.calendarOptions = {
      eventClick: (info) => {
        this.onClickEvent(info);
      },
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
          headerContent: 'Dipendenti'
        },
        {
          field: 'iname',
          headerContent: 'Int.'
        },
        {
          field: 'imobile',
          headerContent: 'Mobile'
        }
      ],
      resources: [
        { id: 'a', fname: 'Mario Rossi', iname: '140', imobile: '+3934567890' },
        { id: 'b', fname: 'Luca Bianchi', iname: '112', imobile: '+3934567890' }
      ],
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth,resourceTimelineYear'
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
      slotDuration: '24:00:00',
      slotLabelFormat: [
        { weekday: 'long', day: 'numeric' },

      ],
      slotMinTime: '00:00:00',
      slotMaxTime: '23:00:00',

      events: [//https://fullcalendar.io/docs/resources-and-events
        {
          id: '1',
          resourceId: 'a',
          title: '09.00 -18.00 Installazione software',
          start: '2024-09-17T00:00:00',
          end: '2024-09-17T24:00:00'
        },

        {
          id: '2',
          resourceId: 'b',
          title: 'Manutenzione server',
          start: '2024-09-18T00:00:00',
          end: '2024-09-18T13:00:00'
        },
        {
          id: '3',
          resourceId: 'b',
          title: 'Manutenzione server',
          start: '2024-09-18T14:00:00',
          end: '2024-09-19T00:00:00'
        }

      ],

    };

  }

  // gestione dell'eventuale click su un evento
  onClickEvent(info: any) {
    this.bodyContent = info.event.title;
    this.visible = true;
  }

}
