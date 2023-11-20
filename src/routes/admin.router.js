const router = require('express').Router();
const { getAllColaboradores,getColaboradorByNumId, addColaborador, updateColaborador, deleteColaborador, patchColaborador} = require('../controllers/admin.controller');

router.post('/colaboradores/', addColaborador);
router.get('/colaboradores/', getAllColaboradores);
router.get('/colaboradores/:numero_identificacion', getColaboradorByNumId); 
router.put('/colaboradores/', updateColaborador);
router.delete('/colaboradores/:numero_identificacion', deleteColaborador);
router.patch('/colaboradores/:numero_identificacion', patchColaborador);


module.exports = router;