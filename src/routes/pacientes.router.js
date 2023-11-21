const express = require('express');
const router = express.Router();
const {addPaciente,getAllPacientes,getPacienteByNumId,updatePaciente,deletePaciente} = require('../controllers/pacientes.controller');

router.post('/pacientes', addPaciente);
router.get('/pacientes', getAllPacientes);
router.get('/pacientes/:numero_identificacion', getPacienteByNumId);
router.put('/pacientes/:numero_identificacion', updatePaciente);
router.delete('/pacientes/:numero_identificacion', deletePaciente);

module.exports = router;