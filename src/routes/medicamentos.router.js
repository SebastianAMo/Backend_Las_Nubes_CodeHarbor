// En tu archivo de rutas (por ejemplo, medicamentos.router.js)
const express = require('express');
const router = express.Router();


const { createMedicamento, getMedicamentos, updateMedicamento, deleteMedicamento} = require('../controllers/medicamentos.controller');
router.post('/medicamentos', createMedicamento);
router.get('/medicamentos', getMedicamentos);
router.put('/medicamentos/:id', updateMedicamento);
router.delete('/medicamentos/:id', deleteMedicamento);

module.exports = router;
