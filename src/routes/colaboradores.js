const express = require('express');
const router = express.Router();

router.get('/perfil', (req, res) => {
    res.send('Endpoint para acceder al perfil del usuario');
});

router.get('/citas-medicas', (req, res) => {
    res.send('Endpoint para ver la información de citas médicas del médico autenticado');
});

router.get('/medicos-asignados', (req, res) => {
    res.send('Endpoint para ver la información de los médicos asignados a la enfermera');
});

module.exports = router;
