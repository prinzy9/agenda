import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular'; // FullCalendar
import { CalendarModule } from 'primeng/calendar'; // PrimeNG Calendar
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import itLocale from '@fullcalendar/core/locales/it';
import { CalendarOptions } from '@fullcalendar/core';
import { DialogModule } from 'primeng/dialog';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // Importa qui



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FullCalendarModule, CalendarModule, DialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  visible: boolean = false;
  title = 'Elmi Agenda';
  calendarOptions: CalendarOptions = {};
  bodyContent: string = '';

  constructor() {
    this.calendarOptions = {
      eventClick: (info) => {
        this.onClickEvent(info);
      },
      schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives', // licenza non commerciale per FullCalendar Scheduler
      timeZone: 'Europe/Rome',
      handleWindowResize: true,
      contentHeight: '85vh',
      // slotMinWidth: 100, // larghezza minima delle slot
      locale: itLocale, // seleziona la lingua Italiana
      aspectRatio: 2, // larghezza / altezza
      initialView: 'resourceTimelineDay', // vista iniziale
      // defaultView: 'resourceTimelinedWeek',
      // initialView: 'timeGrid',
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
        right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth'
      },
      // resourceAreaHeaderContent: 'Dipendenti',
      plugins: [resourceTimelinePlugin], // Registra i plugin qui
      editable: true,
      selectable: true,
      views: {

        resourceTimelineFourDays: {

          type: 'resourceTimeline',
          duration: { days: 4 },

        },

      },
      slotDuration: '24:00:00',
      // slotLabelInterval: '12:00:00',
      slotLabelFormat: [
        { weekday: 'long', day: 'numeric' },

      ],
      slotMinTime: '00:00:00',
      slotMaxTime: '23:00:00',

      events: [//https://fullcalendar.io/docs/resources-and-events
        {
          id: '1',
          resourceId: 'a',
          title: 'Mario Rossi - Installazione software',
          start: '2024-09-16T00:00:00',
          end: '2024-09-16T24:00:00'
        },

        {
          id: '2',
          resourceId: 'b',
          title: 'Luca Bianchi - Manutenzione server',
          start: '2024-09-16T09:00:00',
          end: '2024-09-16T13:00:00'
        },
        {
          id: '3',
          resourceId: 'b',
          title: 'Luca Bianchi - Manutenzione server',
          start: '2024-09-16T14:00:00',
          end: '2024-09-16T18:00:00'
        }

      ],

    };

  }

  onClickEvent(info: any) {
    console.log('clicked on event: ', info.event);
    this.bodyContent = info.event.title;
    this.visible = true;
  }

}
