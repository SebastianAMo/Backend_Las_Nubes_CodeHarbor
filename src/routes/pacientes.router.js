const express = require('express');
const router = express.Router();

router.post('/pacientes', (req, res) => {
    res.send('Endpoint para crear un nuevo paciente');
});

router.get('/pacientes', (req, res) => {
    res.send('Endpoint para consultar todos los pacientes');
});

router.get('/pacientes/:id', (req, res) => {
    res.send(`Endpoint para consultar el paciente con ID ${req.params.id}`);
});

router.put('/pacientes/:id', (req, res) => {
    res.send(`Endpoint para actualizar el paciente con ID ${req.params.id}`);
});

router.delete('/pacientes/:id', (req, res) => {
    res.send(`Endpoint para borrar el paciente con ID ${req.params.id}`);
});

router.get('/pacientes/search', (req, res) => {
    res.send('Endpoint para buscar y filtrar pacientes por criterios');
});

module.exports = router;