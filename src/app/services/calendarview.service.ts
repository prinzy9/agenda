import { Injectable } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Injectable({
  providedIn: 'root'
})
export class CalendarviewService {
  calendarComponent!: FullCalendarComponent;

  constructor() { }
  changeView(view: string) {
    let calendarApi = this.calendarComponent.getApi(); // Ottieni l'API del calendario
    calendarApi.changeView(view);
  }
}
