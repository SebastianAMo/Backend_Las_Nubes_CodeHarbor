const express = require('express');
const router = express.Router();
const citasController = require('../controllers/citas.controller');
const authenticate = require('../middlewares/auth');

router.get('/fechas/:id_medico', citasController.getFechasDisponibles);
router.get('/horas/:id_medico/:fecha', citasController.getHorasDisponibles);
router.get('/especialidades', citasController.getEspecialidades);
router.get('/medicos/:especialidad', citasController.getCitasMedicos);
router.get('/medico/:id_medico', citasController.getCitasMedico);

router.get('/sinasignar', citasController.getCitasSinAsignar);
router.get(
  '/paciente/activas/:numero_identificacion',
  citasController.getCitasPacienteActivas
);
router.get('/activas', authenticate, citasController.getCitasActivas);
router.get(
  '/medico/activas/:numero_identificacion',
  authenticate,
  citasController.getCitasMedicoActivas
);
router.get(
  '/medico/confirmadas/:numero_identificacion',
  authenticate,
  citasController.getCitasMedicoConfirmadas
);
router.get(
  '/medico/encita/:numero_identificacion',
  authenticate,
  citasController.getCitasMedicoenCita
);
router.get(
  '/enfermero/:numero_identificacion',

  citasController.getCitasEnfermero
);

router.post('/pedir/:id_cita', citasController.pedirCita);
router.delete('/cancelar/:id_cita', citasController.cancelCita);
router.patch('/update/:id_cita', citasController.updateCita);

module.exports = router;
