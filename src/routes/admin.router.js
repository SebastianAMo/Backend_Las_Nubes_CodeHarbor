const router = require('express').Router();
const {
  getAllColaboradores,
  getColaboradorByNumId,
  addColaborador,
  deleteColaborador,
  updateColaborador,
} = require('../controllers/admin.controller');
const upload = require('../middlewares/multer');
const authenticate = require('../middlewares/auth');

router.post('/colaboradores/',authenticate, addColaborador);
router.get('/colaboradores/',authenticate, getAllColaboradores);
router.get('/colaboradores/:numero_identificacion',authenticate, getColaboradorByNumId);
router.delete('/colaboradores/:numero_identificacion',authenticate, deleteColaborador);
router.patch(
  '/colaboradores/:numero_identificacion',authenticate,
  upload.single('foto_url'),
  updateColaborador
);

module.exports = router;
