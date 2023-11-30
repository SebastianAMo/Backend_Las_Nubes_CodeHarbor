const express = require('express');
const router = express.Router();
const medicamentoController = require('../controllers/medicamentos.controller');


router.post('/medicamentos', medicamentoController.createMedicamento);
router.get('/medicamentos', medicamentoController.getMedicamentos);
router.put('/medicamentos/:id', medicamentoController.updateMedicamento);
router.delete('/medicamentos/:id', medicamentoController.deleteMedicamento);
router.get('/medicamentos/alertas-vencimiento', medicamentoController.getMedicamentosProximosAVencer);

module.exports = router;
