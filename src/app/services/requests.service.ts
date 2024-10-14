import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  url_resource = environment.apiURL_RESOURCE;
  url_cdc = environment.apiURL_CDC;
  url_events = environment.apiURL_EVENTS;
  private resourcesSubject = new BehaviorSubject<any[]>([]);
  resources$ = this.resourcesSubject.asObservable();
  private eventsSubject = new BehaviorSubject<any[]>([]);
  events$ = this.eventsSubject.asObservable();

  constructor(private http: HttpClient) { }

  getResources(): void {
    this.http.get<any[]>(this.url_resource).pipe(
      map((response: any[]) =>
        response.map(res => ({
          id: res.codiceSistemista,
          fname: res.nomeUtente,
          iname: res.interno || '',
          sede: res.posizione || '',
          area: res.businessUnit,
          imobile: res.cellulare || '',
          email: res.email || ''
        }))
      )
    ).subscribe(data => this.resourcesSubject.next(data));
  }

  getUsersByArea(area: string): Observable<any[]> {
    return this.resources$.pipe(
      map((users) => users.filter((user) => user.area === area))
    );
  }
  getEvents(): Observable<any[]> {
    const body = {
      "startDate": "2024-10-14T12:20:43.690Z",
      "daysrange": 7
    };

    // Restituisce un Observable con il risultato della POST
    return this.http.post<any[]>(this.url_events, body).pipe(
      map(response => {
        return response.flatMap(event => {
          const events = [];

          // Evento per la mattina (se esiste)
          if (event.descrizioneMattina) {
            events.push({
              id: `${event.codiceSistemista}-mattina`,  // Identificativo unico per la mattina
              resourceId: event.codiceSistemista,
              title: event.descrizioneMattina,
              start: event.dataEvento,
              end: this.calculateEndTime(event.dataEvento)
            });
          }

          // Evento per il pomeriggio (se esiste)
          if (event.descrizionePomeriggio) {
            events.push({
              id: `${event.codiceSistemista}-pomeriggio`,  // Identificativo unico per il pomeriggio
              resourceId: event.codiceSistemista,
              title: event.descrizionePomeriggio,
              start: event.dataEvento,
              end: this.calculateEndTime(event.dataEvento)
            });
          }

          return events;  // Ritorna gli eventi mattina e pomeriggio (se esistono)
        });
      })
    );
  }
  // Metodo per calcolare la fine dell'evento (fine giornata)
  calculateEndTime(startDate: string): string {
    const endDate = new Date(startDate);
    endDate.setHours(24, 115, 115, 115);  // Imposta la fine della giornata
    return endDate.toISOString();
  }
}




