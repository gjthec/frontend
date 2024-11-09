import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { importProvidersFrom } from '@angular/core';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(
      ToastrModule.forRoot({
        positionClass: 'toast-top-center', // Exibe no topo central
        timeOut: 3000, // Tempo de exibição de 3 segundos
        closeButton: true, // Adiciona botão de fechar
        progressBar: true, // Exibe barra de progresso
        preventDuplicates: true, // Evita duplicação de mensagens
      })
    ),
  ],
}).catch((err) => console.error(err));
