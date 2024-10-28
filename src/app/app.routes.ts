import { Routes } from '@angular/router';
import { AppComponent } from './app.component';



export const routes: Routes = [
    { path: 'agenda', component: AppComponent }, // Usa AppComponent per la rotta 'agenda'
    { path: '', redirectTo: '/agenda', pathMatch: 'full' }, // Reindirizza a 'agenda'
    
    { path: '**', redirectTo: '/agenda' } // Reindirizza qualsiasi rotta sconosciuta
];
