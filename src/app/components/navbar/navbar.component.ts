import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToggleThemeComponent } from '../toggle-theme/toggle-theme.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { CalendarviewService } from '../../services/calendarview.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule, ToggleThemeComponent, CommonModule, MenuModule, ToastModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] = [];
  giorni: MenuItem[] = [];
  utenti: MenuItem[] = [];

  constructor(private calendarViewService: CalendarviewService) { }

  changeCalendarView(view: string) {
    this.calendarViewService.changeView(view);  // Emetti il cambiamento di vista
  }

  ngOnInit() {

    this.utenti = [
      {
        label: 'Seleziona:',
        items: [
          {
            label: 'Tutti',
            command: () => {
              this.changeCalendarView('resourceTimelineDay');
            }
          },
          {
            label: 'ACG',
            command: () => {
              this.changeCalendarView('resourceTimelineDay');
            }
          },
          {
            label: 'Amministrazione',
            command: () => {
              this.changeCalendarView('resourceTimelineDay');
            }
          },
          {
            label: 'COGNOS BI MRO',
            command: () => {
              this.changeCalendarView('resourceTimelineDay');
            }
          },
          {
            label: 'Progetti Speciali',
            command: () => {
              this.changeCalendarView('resourceTimelineDay');
            }
          },
          {
            label: 'EDOC',
            command: () => {
              this.changeCalendarView('resourceTimelineDay');
            }
          },
          {
            label: 'Infrastruttura',
            command: () => {
              this.changeCalendarView('resourceTimelineDay');
            }
          },
          {
            label: 'SAP',
            command: () => {
              this.changeCalendarView('resourceTimelineDay');
            }
          },

        ]

      }
    ],

      this.giorni = [
        {
          label: 'giorni:',
          items: [
            {
              label: 'Oggi',
              command: () => {
                this.changeCalendarView('resourceTimelineDay');
              }
            },
            {
              label: 'Settimana',
              command: () => {
                this.changeCalendarView('customWeek');
              }
            },
            {
              label: 'Mese',
              command: () => {
                this.changeCalendarView('customMonth');
              }
            },
          ]

        }
      ],




      this.items = [
        {
          label: 'Elmi Calendar',
          icon: 'pi pi-home',
          route: '/Home',
        }
      ]
  }
}