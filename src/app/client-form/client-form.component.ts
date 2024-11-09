import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ClientService } from '../client.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css'],
})
export class ClientFormComponent implements OnInit {
  clientForm: FormGroup;
  selectedFile: File | null = null;
  selectedFileName: string = '';
  isLoading: boolean = false; // Variável de controle para o spinner
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
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router
  ) {
    this.clientForm = this.fb.group({
      cpfCnpj: ['', Validators.required],
      razaoSocial: ['', Validators.required],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cep: ['', Validators.required],
      dataInclusao: ['', Validators.required],
      endereco: ['', Validators.required],
      situacao: ['', Validators.required],
      relatorioUrl: [null],
    });
  }

  ngOnInit(): void {
    this.clientForm.get('cpfCnpj')?.valueChanges.subscribe((value) => {
      this.clientForm
        .get('cpfCnpj')
        ?.setValue(this.sanitizeCpfCnpj(value), { emitEvent: false });
    });
  }

  sanitizeCpfCnpj(value: string): string {
    return value.replace(/\D/g, '');
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      this.isLoading = true;
      const clientData = this.clientForm.value;

      // Formata os dados para o padrão de atributos (sem o `id` ainda)
      const formattedClientData = {
        id: null, // Será atualizado após a resposta da API
        cpfcnpj: clientData.cpfCnpj,
        razaosocial: clientData.razaoSocial,
        cidade: clientData.cidade,
        estado: clientData.estado,
        situacao: clientData.situacao,
        nome_arquivo: this.selectedFileName || null, // Nome do arquivo PDF ou null se não houver
      };

      // Carrega os dados existentes do localStorage ou inicializa um array vazio
      const existingClients = JSON.parse(
        localStorage.getItem('clients') || '[]'
      );

      // Adiciona o novo cliente sem o `id` ao array
      existingClients.push(formattedClientData);

      // Salva o array atualizado no localStorage
      localStorage.setItem('clients', JSON.stringify(existingClients));

      // Chama o serviço para cadastrar o cliente e obter o `id`
      this.clientService.addClient(clientData).subscribe(
        (response) => {
          const clientId = response.id;

          // Atualiza o cliente no localStorage com o `id` correto
          this.updateClientIdInLocalStorage(clientId, clientData.cpfCnpj);

          // Faz o upload do PDF se houver um arquivo selecionado
          if (this.selectedFile instanceof File) {
            this.uploadPdf(this.selectedFile, clientId, clientData.cpfCnpj);
          } else {
            this.finalizeSubmission(); // Finaliza o cadastro e redireciona se não houver arquivo
          }

          // Limpa o formulário e a seleção de arquivo
          this.clientForm.reset();
          this.selectedFile = null;
          this.selectedFileName = '';
        },
        (error) => {
          this.isLoading = false;
        }
      );
    }
  }

  // Função para atualizar o `id` no `localStorage` usando o `cpfCnpj` para identificar o cliente
  private updateClientIdInLocalStorage(id: number, cpfCnpj: string): void {
    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    const clientIndex = clients.findIndex(
      (client: any) => client.cpfcnpj === cpfCnpj
    );

    if (clientIndex !== -1) {
      clients[clientIndex].id = id; // Atualiza o `id` do cliente
      localStorage.setItem('clients', JSON.stringify(clients)); // Salva a atualização
    }
  }

  uploadPdf(file: File, clientId: number, cpfCnpj: string): void {
    const formData = new FormData();
    formData.append('arquivoPdf', file, file.name);
    formData.append('clientId', clientId.toString());
    formData.append('cpfCnpj', cpfCnpj);

    this.clientService.uploadPdf(formData).subscribe(
      () => {
        this.finalizeSubmission(); // Redireciona após o upload do PDF
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  private finalizeSubmission(): void {
    this.isLoading = false;
    this.router.navigate(['/']); // Redireciona para a tela principal
  }
  // Função para capturar o arquivo selecionado
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
    }
  }
}
