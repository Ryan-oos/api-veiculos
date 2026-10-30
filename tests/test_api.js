require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const routes = require('../src/routes');
const db = require('../src/database/db');

async function runTests() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(routes);

  const server = http.createServer(app);
  await new Promise(resolve => server.listen(3001, resolve));
  console.log('----------------------------------------------------');
  console.log(' Servidor de testes iniciado na porta 3001');
  console.log('----------------------------------------------------');

  const baseUrl = 'http://127.0.0.1:3001';

  async function request(path, options = {}) {
    const url = baseUrl + path;
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    const status = res.status;
    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    return { status, data };
  }

  let createdId = null;

  try {
    // 1. GET /veiculos
    console.log('\n[1] Testando GET /veiculos (Listar todos):');
    const r1 = await request('/veiculos');
    console.log(`Status HTTP: ${r1.status}`);
    console.log(`É Array? ${Array.isArray(r1.data)} | Quantidade retornada: ${r1.data.length}`);
    if (r1.status !== 200 || !Array.isArray(r1.data)) {
      throw new Error('Falha no teste GET /veiculos');
    }

    // 2. POST /veiculos - Sucesso (com valor padrão em status_producao)
    console.log('\n[2] Testando POST /veiculos (Sucesso):');
    const newVehicle = {
      modelo: 'Carro Teste Automatizado',
      tipo_propulsao: 'eletrico',
      ano_modelo: 2026,
      autonomia_km: 500,
      capacidade_bateria_kwh: 80.0,
      preco_base: 215000.00
      // status_producao omitido de propósito para testar o padrão 'em_producao'
    };
    const r2 = await request('/veiculos', {
      method: 'POST',
      body: JSON.stringify(newVehicle)
    });
    console.log(`Status HTTP: ${r2.status}`);
    console.log(`Resposta:`, r2.data);
    if (r2.status !== 201 || !r2.data.id) {
      throw new Error('Falha no teste POST /veiculos: registro não foi criado');
    }
    if (r2.data.status_producao !== 'em_producao') {
      throw new Error('Falha: status_producao padrão não foi definido como "em_producao"');
    }
    createdId = r2.data.id;
    console.log(`-> Veículo criado com sucesso com ID: ${createdId}`);

    // 3. POST /veiculos - Validações de Erro (400)
    console.log('\n[3] Testando POST /veiculos (Erros de validação - 400):');
    const r3_invalid_enum = await request('/veiculos', {
      method: 'POST',
      body: JSON.stringify({
        modelo: 'Veiculo Invalido',
        tipo_propulsao: 'gasolina', // Inválido (apenas 'eletrico' ou 'hibrido')
        ano_modelo: 2026,
        preco_base: 100000
      })
    });
    console.log(`Tipo propulsão inválido -> Status: ${r3_invalid_enum.status} | Resposta:`, r3_invalid_enum.data);
    if (r3_invalid_enum.status !== 400) {
      throw new Error('Esperava status 400 para tipo_propulsao inválido');
    }

    const r3_missing = await request('/veiculos', {
      method: 'POST',
      body: JSON.stringify({
        ano_modelo: 2026
      })
    });
    console.log(`Campos obrigatórios ausentes -> Status: ${r3_missing.status} | Resposta:`, r3_missing.data);
    if (r3_missing.status !== 400) {
      throw new Error('Esperava status 400 para campos obrigatórios ausentes');
    }

    // 4. GET /veiculos/:id (Sucesso)
    console.log(`\n[4] Testando GET /veiculos/${createdId} (Buscar por ID existente):`);
    const r4 = await request(`/veiculos/${createdId}`);
    console.log(`Status HTTP: ${r4.status}`);
    console.log(`Dados do veículo:`, r4.data);
    if (r4.status !== 200 || r4.data.id !== createdId) {
      throw new Error(`Falha no GET /veiculos/${createdId}`);
    }

    // 5. GET /veiculos/:id (Erros: 404 e 400)
    console.log('\n[5] Testando GET /veiculos/:id (Cenários de Erro):');
    const r5_notfound = await request('/veiculos/99999999');
    console.log(`ID Inexistente (99999999) -> Status: ${r5_notfound.status} | Resposta:`, r5_notfound.data);
    if (r5_notfound.status !== 404) {
      throw new Error('Esperava status 404 para ID inexistente');
    }

    const r5_badid = await request('/veiculos/abc');
    console.log(`ID Inválido ("abc") -> Status: ${r5_badid.status} | Resposta:`, r5_badid.data);
    if (r5_badid.status !== 400) {
      throw new Error('Esperava status 400 para ID não numérico');
    }

    // 6. PUT /veiculos/:id (Sucesso)
    console.log(`\n[6] Testando PUT /veiculos/${createdId} (Atualizar dados existentes):`);
    const updateData = {
      modelo: 'Carro Teste Atualizado Automatizado',
      status_producao: 'descontinuado',
      preco_base: 199900.00
    };
    const r6 = await request(`/veiculos/${createdId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
    console.log(`Status HTTP: ${r6.status}`);
    console.log(`Veículo Atualizado:`, r6.data);
    if (
      r6.status !== 200 ||
      r6.data.modelo !== updateData.modelo ||
      r6.data.status_producao !== 'descontinuado'
    ) {
      throw new Error(`Falha na atualização do veículo ID ${createdId}`);
    }

    // 7. PUT /veiculos/:id (Erros: 404 e 400)
    console.log('\n[7] Testando PUT /veiculos/:id (Cenários de Erro):');
    const r7_notfound = await request('/veiculos/99999999', {
      method: 'PUT',
      body: JSON.stringify({ modelo: 'Novo Nome' })
    });
    console.log(`PUT ID Inexistente -> Status: ${r7_notfound.status} | Resposta:`, r7_notfound.data);
    if (r7_notfound.status !== 404) {
      throw new Error('Esperava status 404 para PUT em ID inexistente');
    }

    // 8. DELETE /veiculos/:id (Sucesso)
    console.log(`\n[8] Testando DELETE /veiculos/${createdId} (Remover veículo):`);
    const r8 = await request(`/veiculos/${createdId}`, {
      method: 'DELETE'
    });
    console.log(`Status HTTP: ${r8.status} | Resposta:`, r8.data);
    if (r8.status !== 200) {
      throw new Error(`Falha no DELETE /veiculos/${createdId}`);
    }

    // 9. DELETE /veiculos/:id (Erro: 404)
    console.log('\n[9] Testando DELETE /veiculos/:id (Erro 404 para ID já removido):');
    const r9 = await request(`/veiculos/${createdId}`, {
      method: 'DELETE'
    });
    console.log(`DELETE já removido -> Status: ${r9.status} | Resposta:`, r9.data);
    if (r9.status !== 404) {
      throw new Error('Esperava status 404 para exclusão de registro inexistente');
    }

    console.log('\n======================================================');
    console.log('  SUCESSO: TODOS OS TESTES PASSARAM COM EXCELÊNCIA!   ');
    console.log('======================================================\n');
  } finally {
    server.close();
    await db.destroy();
  }
}

runTests().catch(err => {
  console.error('Erro na execução dos testes:', err);
  process.exit(1);
});
