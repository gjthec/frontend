import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ClientService } from '../client.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-client-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.css'],
})
export class ClientEditComponent implements OnInit {
  clientForm: FormGroup;
  clientId: string;
  selectedFile: File | null = null;
  nome_arquivo: string = ''; // Variável para armazenar o nome do arquivo
  isLoading: boolean = false;

  // Array de estados brasileiros
  estados: string[] = [
    'AC',
    'AL',
    'AP',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MT',
    'MS',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO',
  ];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router
  ) {
    this.clientForm = this.fb.group({
      cpfcnpj: ['', Validators.required],
      razaosocial: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      situacao: ['', Validators.required],
      relatorioUrl: [null],
    });
    this.clientId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    if (this.clientId) {
      this.isLoading = true;
      const localClients = JSON.parse(localStorage.getItem('clients') || '[]');
      const localClient = localClients.find(
        (client: any) => String(client.id) === String(this.clientId)
      );

      if (localClient) {
        this.clientForm.patchValue(localClient);
        this.nome_arquivo = localClient.nome_arquivo || ''; // Inicializa nome_arquivo do localStorage
        this.isLoading = false;
      } else {
        this.clientService.getClientById(this.clientId).subscribe(
          (client) => {
            this.clientForm.patchValue(client);
            this.nome_arquivo = client.nome_arquivo || '';
            this.isLoading = false;
          },
          (error) => {
            console.error('Erro ao buscar cliente:', error);
            this.isLoading = false;
          }
        );
      }
    }
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      this.isLoading = true;
      const clientData = this.clientForm.value;

      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('cpfCnpj', clientData.cpfcnpj);
        formData.append('razaoSocial', clientData.razaosocial);
        formData.append('cidade', clientData.cidade);
        formData.append('estado', clientData.estado);
        formData.append('situacao', clientData.situacao);
        formData.append('clientId', this.clientId);
        formData.append('arquivoPdf', this.selectedFile, this.nome_arquivo);

        this.clientService.updateClientWithPdf(formData).subscribe(
          () => {
            this.updateClientInLocalStorage(
              this.clientId,
              clientData,
              this.nome_arquivo
            );
            this.isLoading = false;
            this.router.navigate(['/clients']);
          },
          (error) => {
            console.error('Erro ao atualizar cliente e enviar PDF:', error);
            this.isLoading = false;
          }
        );
      } else {
        this.clientService.updateClient(this.clientId, clientData).subscribe(
          () => {
            this.updateClientInLocalStorage(
              this.clientId,
              clientData,
              this.nome_arquivo
            );
            this.isLoading = false;
            this.router.navigate(['/clients']);
          },
          (error) => {
            console.error('Erro ao atualizar cliente:', error);
            this.isLoading = false;
          }
        );
      }
    }
  }

  private updateClientInLocalStorage(
    id: string,
    clientData: any,
    nomeArquivo: string
  ): void {
    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    const clientIndex = clients.findIndex(
      (client: any) => String(client.id) === String(id)
    );

    if (clientIndex !== -1) {
      clients[clientIndex] = {
        ...clients[clientIndex],
        ...clientData,
        ...(nomeArquivo && { nome_arquivo: nomeArquivo }),
      };

      localStorage.setItem('clients', JSON.stringify(clients));
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.nome_arquivo = this.selectedFile.name; // Define o nome do arquivo selecionado
    }
  }
}
