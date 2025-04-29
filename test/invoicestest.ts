import request from 'supertest';

// Base URL da API
const baseURL = 'https://api.practicesoftwaretesting.com/api';

// Seu token de autenticação (substitua isso com o token real)
const authToken = 'YOUR_TOKEN_HERE'; // Substitua pelo seu token real

let createdInvoiceId: number;

describe('Testes de integração para a API de Invoices', () => {

  // Teste POST - Criar uma nova invoice
  it('Deve criar uma nova invoice', async () => {
    const invoiceData = {
      customer_id: 1,
      due_date: '2025-05-20',
      invoice_number: `INV-${Date.now()}`,
      total: 100.00,
    };

    const response = await request(baseURL)
      .post('/invoices')
      .set('Authorization', `Bearer ${authToken}`) // Adicionando o token de autenticação
      .send(invoiceData);

    // Verifica se o status é 201 e se a fatura foi criada
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');

    // Armazena o ID da invoice criada para usá-lo nos testes subsequentes
    createdInvoiceId = response.body.id;
  });

  // Teste GET - Buscar todas as invoices
  it('Deve retornar a lista de invoices', async () => {
    const response = await request(baseURL)
      .get('/invoices')
      .set('Authorization', `Bearer ${authToken}`); // Adicionando o token de autenticação

    // Verifica se a resposta tem status 200 e retorna um array de invoices
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Teste GET - Buscar invoice por ID
  it('Deve retornar uma invoice específica', async () => {
    const response = await request(baseURL)
      .get(`/invoices/${createdInvoiceId}`)
      .set('Authorization', `Bearer ${authToken}`); // Adicionando o token de autenticação

    // Verifica se a invoice retornada tem o ID correto
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', createdInvoiceId);
  });

  // Teste PUT - Atualizar invoice
  it('Deve atualizar o valor total da invoice', async () => {
    const response = await request(baseURL)
      .put(`/invoices/${createdInvoiceId}`)
      .set('Authorization', `Bearer ${authToken}`) // Adicionando o token de autenticação
      .send({
        total: 200.00
      });

    // Verifica se o status é 200 e se o valor da invoice foi atualizado
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('total', 200.00);
  });

  // Teste DELETE - Excluir invoice
  it('Deve deletar a invoice', async () => {
    const response = await request(baseURL)
      .delete(`/invoices/${createdInvoiceId}`)
      .set('Authorization', `Bearer ${authToken}`); // Adicionando o token de autenticação
    
    // Verifica se a exclusão foi bem-sucedida (status 204 significa sem conteúdo)
    expect(response.status).toBe(204);
  });

  // Verifica se a invoice foi realmente excluída
  it('Deve retornar 404 ao buscar invoice deletada', async () => {
    const response = await request(baseURL)
      .get(`/invoices/${createdInvoiceId}`)
      .set('Authorization', `Bearer ${authToken}`); // Adicionando o token de autenticação
    
    // Verifica se a invoice deletada retorna um erro 404
    expect(response.status).toBe(404);
  });
});
