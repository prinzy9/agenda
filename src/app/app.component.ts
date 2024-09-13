import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular'; // FullCalendar
import dayGridPlugin from '@fullcalendar/daygrid'; // plugin day grid
import timeGridPlugin from '@fullcalendar/timegrid'; // plugin time grid
import interactionPlugin from '@fullcalendar/interaction'; // for user interactions
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import timelinePlugin from '@fullcalendar/resource-timeline';
import { CalendarModule } from 'primeng/calendar'; // PrimeNG Calendar
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import itLocale from '@fullcalendar/core/locales/it';
import { CalendarOptions } from '@fullcalendar/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FullCalendarModule, CalendarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Elmi Agenda';
  calendarOptions: CalendarOptions = {};

  constructor() {
    this.calendarOptions = {
      schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives', // licenza non commerciale per FullCalendar Scheduler
      locale: itLocale, // seleziona la lingua Italiana
      aspectRatio: 3.5, // larghezza / altezza
      initialView: 'resourceTimelineDay', // vista iniziale
      // defaultView: 'resourceTimelinedWeek',
      // initialView: 'timeGrid',
      resources: [
        { id: 'a', title: 'Mario Rossi' },
        { id: 'b', title: 'Luca Bianchi' }
      ],
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth'
      },
      resourceAreaHeaderContent: 'Dipendenti',
      plugins: [resourceTimelinePlugin], // Registra i plugin qui
      editable: true,
      selectable: true,
      views: {
        resourceTimelineFourDays: {
          type: 'resourceTimeline',
          duration: { days: 4 },

        },

      },
      slotDuration: '01:00:00',
      slotMinTime: '09:00:00',
      slotMaxTime: '18:00:00',
      // slotMinWidth: 10,

      events: [//https://fullcalendar.io/docs/resources-and-events
        {
          id: '1',
          resourceId: 'a',
          title: 'Mario Rossi - Installazione software',
          start: '2024-09-13T09:00:00',
          end: '2024-09-13T13:00:00'
        },
        {
          id: '2',
          resourceId: 'b',
          title: 'Luca Bianchi - Manutenzione server',
          start: '2024-09-14T09:00:00',
          end: '2024-09-14T13:00:00'
        },
        {
          id: '3',
          resourceId: 'b',
          title: 'Luca Bianchi - Manutenzione server',
          start: '2024-09-14T14:00:00',
          end: '2024-09-14T18:00:00'
        }
      ]
    };

  }
}
