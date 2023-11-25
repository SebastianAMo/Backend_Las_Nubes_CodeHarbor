const express = require('express');
const router = express.Router();
const {
  cancelCita,
  getCitasPaciente,
} = require('../controllers/citas.controller');

router.get('/citas/:id', getCitasPaciente);
router.delete('/citas/:id', cancelCita);

module.exports = router;
