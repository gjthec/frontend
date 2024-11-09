export interface Client {
    id?: string; // Campo opcional, pois o ID geralmente é gerado pelo banco de dados
    cpfCnpj: string; // CPF ou CNPJ do cliente
    razaoSocial: string; // Razão social do cliente
    bairro: string; // Bairro onde o cliente reside
    cidade: string; // Cidade onde o cliente reside
    estado: string; // Estado onde o cliente reside
    telefone: string; // Telefone de contato do cliente
    email: string; // Email de contato do cliente
    cep: string; // CEP da localização do cliente
    dataInclusao: Date; // Data de inclusão definida pelo usuário
    endereco: string; // Endereço completo do cliente
    situacao: 'Em Processo' | 'Nome Limpo'; // Situação do cliente: Em Processo ou Nome Limpo
    relatorioUrl?: string; // URL do PDF do relatório, campo opcional
  }
  