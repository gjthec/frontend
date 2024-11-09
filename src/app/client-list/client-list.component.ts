import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClientService } from '../client.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CommonModule,
  ],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css'],
})
export class ClientListComponent implements OnInit {
  clients: any[] = [];
  displayedColumns: string[] = [
    'cpfCnpj',
    'razaoSocial',
    'cidade',
    'estado',
    'situacao',
    'arquivo',
    'actions',
  ];
  isLoading: boolean = false; // Controle do spinner

  constructor(
    private clientService: ClientService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  // Carregar lista de clientes do localStorage ou do backend
  loadClients(): void {
    const storedClients = localStorage.getItem('clients');

    if (storedClients) {
      this.clients = JSON.parse(storedClients);
    } else {
      this.clientService.getClients().subscribe(
        (data) => {
          this.clients = data;
          localStorage.setItem('clients', JSON.stringify(this.clients)); // Salva os dados no localStorage
        },
        (error) => {
          this.toastr.error('Erro ao carregar lista de clientes.', 'Erro');
        }
      );
    }
  }

  // Navegar para a edição do cliente
  editClient(clientId: string): void {
    this.router.navigate(['/clients/edit', clientId]);
  }

  // Função para excluir cliente com tentativa de reconexão
  deleteClientWithRetries(
    clientId: string,
    retries: number = 3,
    delay: number = 2000
  ): void {
    if (
      confirm(
        `Tem certeza de que deseja excluir o cliente com ID: ${clientId}?`
      )
    ) {
      this.isLoading = true; // Ativa o spinner
      this.tryDeleteClient(clientId, retries, delay);
    }
  }

  private tryDeleteClient(
    clientId: string,
    retries: number,
    delay: number
  ): void {
    this.clientService.deleteClient(clientId).subscribe(
      () => {
        this.toastr.success('Cliente excluído com sucesso!', 'Sucesso');
        this.removeClientFromLocalStorage(clientId); // Remove o cliente do LocalStorage
        this.loadClients(); // Atualiza a lista após a exclusão
        this.isLoading = false; // Desativa o spinner
      },
      (error) => {
        this.toastr.error(`Erro ao excluir cliente: ${error.message}`, 'Erro');
        if (retries > 0) {
          this.toastr.info(
            `Tentando novamente em ${delay / 1000} segundos...`,
            'Tentativa de Reexecução'
          );
          setTimeout(() => {
            this.tryDeleteClient(clientId, retries - 1, delay);
          }, delay);
        } else {
          this.toastr.error(
            'Erro ao excluir o cliente após várias tentativas. Por favor, tente novamente mais tarde.',
            'Erro'
          );
          this.isLoading = false; // Desativa o spinner após falha
        }
      }
    );
  }

  // Remove o cliente do localStorage
  private removeClientFromLocalStorage(clientId: string): void {
    this.clients = this.clients.filter((client) => client.id !== clientId);
    localStorage.setItem('clients', JSON.stringify(this.clients));
    this.toastr.success('Cliente removido do LocalStorage.', 'LocalStorage');
  }
}
