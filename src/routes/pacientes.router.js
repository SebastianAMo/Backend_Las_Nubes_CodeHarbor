const express = require('express');
const router = express.Router();
const {addPaciente,getAllPacientes,getPacienteByNumId,updatePaciente,deletePaciente} = require('../controllers/pacientes.controller');
const upload = require('../middlewares/multer');

router.post('/pacientes', addPaciente);
router.get('/pacientes', getAllPacientes);
router.get('/pacientes/:numero_identificacion', getPacienteByNumId);
router.patch('/pacientes/:numero_identificacion',upload.single("foto_url"), updatePaciente);
router.delete('/pacientes/:numero_identificacion', deletePaciente);

module.exports = router;