import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = 'https://backend-3s0z.onrender.com/api/clients'; // URL base da API

  constructor(private http: HttpClient) {}

  // Cadastrar um novo cliente
  addClient(clientData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, clientData);
  }

  // Obter todos os clientes
  getClients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Obter um cliente específico pelo ID
  getClientById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  deleteClient(clientId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${clientId}`, {
      responseType: 'text',
    });
  }
  // Atualizar cliente com PDF
  updateClientWithPdf(formData: FormData) {
    return this.http.put(
      `${this.apiUrl}/${formData.get('clientId')}/upload-pdf`,
      formData
    );
  }
  // Atualizar um cliente existente
  updateClient(id: string, clientData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, clientData);
  }
  // client.service.ts
  uploadPdf(formData: FormData): Observable<any> {
    const uploadUrl = 'https://backend-3s0z.onrender.com/api/upload';
    return this.http.post(uploadUrl, formData, { responseType: 'text' });
  }
}
