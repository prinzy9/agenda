import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarviewService {
  private dateChangeSource = new Subject<Date>();
  dateChange$ = this.dateChangeSource.asObservable();
  private viewChangeSource = new Subject<string>();
  viewChange$ = this.viewChangeSource.asObservable();

  // Metodo per emettere il cambiamento di vista
  changeView(view: string) {
    this.viewChangeSource.next(view);
  }
  changeDate(date: Date) {
    this.dateChangeSource.next(date);
  }
}
