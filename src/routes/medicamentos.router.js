<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const medicamentoController = require('../controllers/medicamentos.controller');


router.post('/medicamentos', medicamentoController.createMedicamento);
router.get('/medicamentos', medicamentoController.getMedicamentos);
router.put('/medicamentos/:id', medicamentoController.updateMedicamento);
router.delete('/medicamentos/:id', medicamentoController.deleteMedicamento);
router.get('/medicamentos/alertas-vencimiento', medicamentoController.getMedicamentosProximosAVencer);
=======
const router = require('express').Router();

router.post('/medicamentos', (req, res) => {
  res.send('Medicamentos POST');
});

router.get('/medicamentos', (req, res) => {
  res.send('Medicamentos GET');
});

router.get('/medicamentos/:id', (req, res) => {
  res.send('Medicamentos GET by ID');
});

router.put('/medicamentos/:id', (req, res) => {
  res.send('Medicamentos PUT');
});

router.delete('/medicamentos/:id', (req, res) => {
  res.send('Medicamentos DELETE');
});

router.get('/medicamentos/search', (req, res) => {
  res.send('Medicamentos SEARCH');
});
>>>>>>> main

module.exports = router;
