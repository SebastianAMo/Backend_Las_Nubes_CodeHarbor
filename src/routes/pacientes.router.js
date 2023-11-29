const express = require('express');
const router = express.Router();
const {
  addPaciente,
  getAllPacientes,
  getPacienteByNumId,
  updatePaciente,
  deletePaciente,
} = require('../controllers/pacientes.controller');
const authenticate = require('../middlewares/auth');
const upload = require('../middlewares/multer');

router.post('/pacientes', authenticate, addPaciente);
router.get('/pacientes', authenticate, getAllPacientes);
router.get(
  '/pacientes/:numero_identificacion',
  authenticate,
  getPacienteByNumId
);
router.patch(
  '/pacientes/:numero_identificacion',
  authenticate,
  upload.single('foto_url'),
  updatePaciente
);
router.delete('/pacientes/:numero_identificacion', deletePaciente);

module.exports = router;