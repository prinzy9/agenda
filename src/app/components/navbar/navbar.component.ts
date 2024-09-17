import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { ToggleThemeComponent } from '../toggle-theme/toggle-theme.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule, ToggleThemeComponent, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] = [];
  constructor(private router: Router) { }


  ngOnInit() {

    this.items = [
      {
        label: 'Elmi Calendar',
        icon: 'pi pi-home',
        route: '/Home',
      }
    ]
  }
}