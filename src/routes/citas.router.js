const express = require('express');
const router = express.Router();

router.post('/citas', (req, res) => {
    res.send('Endpoint para solicitar una cita médica');
});

router.get('/citas', (req, res) => {
    res.send('Endpoint para consultar todas las citas médicas');
});

router.get('/citas/:id', (req, res) => {
    res.send(`Endpoint para consultar la cita médica con ID ${req.params.id}`);
});

router.delete('/citas/:id', (req, res) => {
    res.send(`Endpoint para cancelar la cita médica con ID ${req.params.id}`);
});

module.exports = router;
