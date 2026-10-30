require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');

const app = express();

// Middlewares essenciais
app.use(cors());
app.use(express.json());

// Rota raiz para verificação rápida de status da API
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    mensagem: 'API REST de Gerenciamento de Veículos ativa.',
    endpoints: {
      listar_veiculos: 'GET /veiculos',
      buscar_veiculo: 'GET /veiculos/:id',
      cadastrar_veiculo: 'POST /veiculos',
      atualizar_veiculo: 'PUT /veiculos/:id',
      remover_veiculo: 'DELETE /veiculos/:id'
    }
  });
});

// Registro das rotas da aplicação
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
  console.log(` Servidor rodando na porta ${PORT}`);
  console.log(` Endereço: http://localhost:${PORT}`);
  console.log(` Recurso de veículos: http://localhost:${PORT}/veiculos`);
  console.log(`====================================================`);
});
