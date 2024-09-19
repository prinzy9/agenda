import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToggleThemeComponent } from '../toggle-theme/toggle-theme.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';

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

  constructor(private router: Router) { }


  ngOnInit() {

    this.giorni = [
      {
        label: 'giorni:',
        items: [
          {
            label: '1',
            command: () => {
              this.router.navigate(['/Home']);
            }
          },
          {
            label: '7',
            command: () => {
              this.router.navigate(['/Home']);
            }
          },
          {
            label: '31',
            command: () => {
              this.router.navigate(['/Home']);
            }
          },
        ]

      }
    ]

    this.items = [
      {
        label: 'Elmi Calendar',
        icon: 'pi pi-home',
        route: '/Home',
      }
    ]
  }
}