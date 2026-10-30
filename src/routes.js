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
