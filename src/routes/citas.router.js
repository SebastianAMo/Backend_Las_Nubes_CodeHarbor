const express = require('express');
const router = express.Router();
const citasController = require('../controllers/citas.controller');

router.get('/sinasignar', citasController.getCitasSinAsignar);
router.get(
  '/paciente/activas/:numero_identificacion',
  citasController.getCitasPacienteActivas
);
router.get('/activas', citasController.getCitasActivas);
router.get(
  '/medico/activas/:numero_identificacion',
  citasController.getCitasMedicoActivas
);
router.get(
  '/medico/confirmadas/:numero_identificacion',
  citasController.getCitasMedicoConfirmadas
);
router.get(
  '/medico/encita/:numero_identificacion',
  citasController.getCitasMecicoenCita
);
router.post('/pedir/:id_cita', citasController.pedirCita);
router.delete('/cancelar/:id_cita', citasController.cancelCita);
router.patch('/update/:id_cita', citasController.updateCita);

module.exports = router;
