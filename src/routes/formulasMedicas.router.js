const express = require('express');
const router = express.Router();
const formulasMedicasController = require('../controllers/formulasMedicas.controller');

// Corregir aquí: Cambiar 'formulasMedicasController.formulasMedicasController' a 'formulasMedicasController.createFormulaMedica'
router.post('/formulas-medicas', formulasMedicasController.createFormulaMedica);
router.get(
  '/formulas-medicas/paciente/:id',
  formulasMedicasController.getFormulasMedicasByPaciente
);
module.exports = router;
