// shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../client.service';

@NgModule({
  imports: [CommonModule],
  providers: [ClientService], // Registre o serviço aqui
})
export class SharedModule {}
