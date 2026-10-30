/**
 * ============================================================================
 * Projeto: API REST de Gerenciamento de Veículos
 * Autor: Ryan da Silva Benedito
 * Disciplina: Programação cliente/servidor - FAETERJ
 * Professor: Henrique Barbosa
 *
 * Descrição:
 * Módulo de conexão com o banco de dados. Instancia e exporta o cliente Knex
 * utilizando as credenciais e configurações definidas no knexfile.js.
 * ============================================================================
 */

const knex = require('knex');
const knexConfig = require('../../knexfile');

const db = knex(knexConfig);

module.exports = db;
