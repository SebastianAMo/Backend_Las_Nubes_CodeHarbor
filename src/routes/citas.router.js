const express = require('express');
const router = express.Router();
const {createCita, cancelCita,getCitasPaciente } = require('../controllers/citas.controller');

router.post('/citas', createCita);
router.get('/citas/:id', getCitasPaciente);
router.delete('/citas/:id', cancelCita);

module.exports = router;
