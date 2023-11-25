const router = require('express').Router();
const {
  getAllColaboradores,
  getColaboradorByNumId,
  addColaborador,
  deleteColaborador,
  updateColaborador,
} = require('../controllers/admin.controller');
const upload = require('../middlewares/multer');

router.post('/colaboradores/', addColaborador);
router.get('/colaboradores/', getAllColaboradores);
router.get('/colaboradores/:numero_identificacion', getColaboradorByNumId);
router.delete('/colaboradores/:numero_identificacion', deleteColaborador);
router.patch(
  '/colaboradores/:numero_identificacion',
  upload.single('foto_url'),
  updateColaborador
);

module.exports = router;
