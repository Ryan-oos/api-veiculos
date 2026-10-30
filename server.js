/**
 * ============================================================================
 * Projeto: API REST de Gerenciamento de Veículos
 * Autor: Ryan da Silva Benedito
 * Disciplina: Programação cliente/servidor - FAETERJ
 * Professor: Henrique Barbosa
 *
 * Descrição:
 * Servidor principal da aplicação Express. Inicializa os middlewares de CORS e
 * parser JSON, mapeia as rotas de gerenciamento de veículos (/veiculos), trata
 * rotas não encontradas (404) e disponibiliza o serviço na porta configurada.
 * ============================================================================
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');

const app = express();

// Middlewares essenciais
app.use(cors());
app.use(express.json());

// Rota raiz: informações da API, autor e documentação dos endpoints
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    projeto: 'API REST de Gerenciamento de Veículos',
    desenvolvedor: 'Ryan da Silva Benedito',
    disciplina: 'Programação cliente/servidor - FAETERJ',
    professor: 'Henrique Barbosa',
    descricao: 'Backend para gerenciar veículos de montadora com operações completas de CRUD (GET, POST, PUT, DELETE) conectado a banco PostgreSQL.',
    endpoints: {
      listar_veiculos: 'GET /veiculos',
      buscar_veiculo_por_id: 'GET /veiculos/:id',
      cadastrar_veiculo: 'POST /veiculos',
      atualizar_veiculo: 'PUT /veiculos/:id',
      remover_veiculo: 'DELETE /veiculos/:id'
    }
  });
});

// Registro das rotas do recurso /veiculos
app.use(routes);

// Tratamento para rotas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({
    mensagem: 'Rota não encontrada.'
  });
});

// Definição da porta por variável de ambiente com valor padrão 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` API REST de Gerenciamento de Veículos`);
  console.log(` Desenvolvedor: Ryan da Silva Benedito`);
  console.log(` Servidor rodando na porta ${PORT}`);
  console.log(` Endereço base: http://localhost:${PORT}`);
  console.log(` Recurso de veículos: http://localhost:${PORT}/veiculos`);
  console.log(`====================================================`);
});
