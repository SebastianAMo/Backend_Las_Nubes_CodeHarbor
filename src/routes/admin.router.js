const router = require('express').Router();
const { getAllColaboradores,getColaboradorByNumId, addColaborador, deleteColaborador, updateColaborador} = require('../controllers/admin.controller');

router.post('/colaboradores/', addColaborador);
router.get('/colaboradores/', getAllColaboradores);
router.get('/colaboradores/:numero_identificacion', getColaboradorByNumId); 

router.delete('/colaboradores/:numero_identificacion', deleteColaborador);
router.patch('/colaboradores/:numero_identificacion', updateColaborador);


module.exports = router;