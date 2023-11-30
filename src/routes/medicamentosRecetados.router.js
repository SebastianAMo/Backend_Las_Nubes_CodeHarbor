const express = require('express');
const router = express.Router();
const medicamentosRecetadosController = require('../controllers/medicamentosRecetados.controller');

router.post('/medicamentos-recetados', medicamentosRecetadosController.createMedicamentoRecetado);
router.post('/medicamentos-recetados/rechazar/:id', medicamentosRecetadosController.rejectMedicamentoRecetado);

module.exports = router;
