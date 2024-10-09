import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  url_resource = environment.apiURL_RESOURCE;
  url_cdc = environment.apiURL_CDC;
  private resourcesSubject = new BehaviorSubject<any[]>([]);
  resources$ = this.resourcesSubject.asObservable();

  constructor(private http: HttpClient) { }

  getResources(): void {
    this.http.get<any[]>(this.url_resource).pipe(
      map((response: any[]) =>
        response.map(res => ({
          id: res.codiceSistemista,
          fname: res.nomeUtente,
          iname: res.interno,
          sede: res.posizione || 'sede',
          area: res.businessUnit,
          imobile: res.cellulare || '+39',
          email: res.email
        }))
      )
    ).subscribe(data => this.resourcesSubject.next(data));
  }

  getUsersByArea(area: string): Observable<any[]> {
    return this.resources$.pipe(
      map((users) => users.filter((user) => user.area === area))
    );
  }

  postEvents() { }

}

