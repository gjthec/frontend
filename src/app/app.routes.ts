import { Routes } from '@angular/router';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientFormComponent } from './client-form/client-form.component';
import { ClientEditComponent } from './client-edit/client-edit.component';

export const routes: Routes = [
  { path: 'clients', component: ClientListComponent },
  { path: 'clients/new', component: ClientFormComponent },
  { path: 'clients/edit/:id', component: ClientEditComponent },
  { path: '', redirectTo: '/clients', pathMatch: 'full' },
];
