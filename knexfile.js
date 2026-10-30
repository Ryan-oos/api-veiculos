/**
 * ============================================================================
 * Projeto: API REST de Gerenciamento de Veículos
 * Autor: Ryan da Silva Benedito
 * Disciplina: Programação cliente/servidor - FAETERJ
 * Professor: Henrique Barbosa
 *
 * Descrição:
 * Arquivo de configuração do Knex. Lê a variável DATABASE_URL do arquivo .env,
 * define o client 'pg' (PostgreSQL) e habilita SSL para comunicação segura
 * com o banco de dados hospedado no Neon.
 * ============================================================================
 */

require('dotenv').config();

const config = {
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  },
  pool: {
    min: 2,
    max: 10
  }
};

module.exports = {
  ...config,
  development: config,
  production: config
};
