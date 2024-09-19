import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarviewService {
  private viewChangeSource = new Subject<string>();

  // Observable a cui il componente principale si iscrive
  viewChange$ = this.viewChangeSource.asObservable();

  // Metodo per emettere il cambiamento di vista
  changeView(view: string) {
    this.viewChangeSource.next(view);
  }
}
