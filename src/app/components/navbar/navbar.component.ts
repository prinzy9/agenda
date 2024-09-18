import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToggleThemeComponent } from '../toggle-theme/toggle-theme.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule, ToggleThemeComponent, CommonModule, MenuModule, ToastModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] = [];
  utenti: MenuItem[] = [];
  constructor(private router: Router) { }


  ngOnInit() {

    this.utenti = [
      {
        label: 'Logout',
        icon: 'pi pi-power-off',
      }]

    this.items = [
      {
        label: 'Elmi Calendar',
        icon: 'pi pi-home',
        route: '/Home',
      }
    ]
  }
}