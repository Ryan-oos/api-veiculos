/**
 * ============================================================================
 * Projeto: API REST de Gerenciamento de Veículos
 * Autor: Ryan da Silva Benedito
 * Disciplina: Programação cliente/servidor - FAETERJ
 * Professor: Henrique Barbosa
 *
 * Descrição:
 * Camada de Rotas (Routing). Define e distribui os endpoints REST para o
 * recurso '/veiculos' associando cada verbo HTTP (GET, POST, PUT, DELETE) ao
 * seu respectivo método no controlador.
 * ============================================================================
 */

const { Router } = require('express');
const veiculosController = require('./controllers/veiculosController');

const router = Router();

// Rotas do recurso /veiculos
router.get('/veiculos', veiculosController.listar);
router.get('/veiculos/:id', veiculosController.buscarPorId);
router.post('/veiculos', veiculosController.criar);
router.put('/veiculos/:id', veiculosController.atualizar);
router.delete('/veiculos/:id', veiculosController.deletar);

module.exports = router;
