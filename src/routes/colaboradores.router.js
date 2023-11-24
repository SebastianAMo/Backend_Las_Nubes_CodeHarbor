const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUser,
  disabledUser,
  activeUser,
  getInforme,
  getCitasActivas,
  getCitasActivasColaborador,
  getCitasConfiColaborador,
  updateCita
} = require('../controllers/colaboradores.controller');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

//router.delete('/:id', authenticate, authorize(['admin']), disabledUser);

router.get('/', getUsers);
router.get('/:id',  getUserById);
router.patch('/:id',  updateUser);
router.delete('/:id',  disabledUser);
router.patch('/activate/:id',  activeUser);
router.get('/informe/:option',getInforme);
router.get('/citaActivas/1',getCitasActivas);
router.get('/citascolaborador/:numero_identificacion',getCitasActivasColaborador);
router.get('/citascolaboradorconf/:numero_identificacion',getCitasConfiColaborador);
router.patch('/update/:id_cita',updateCita);

module.exports = router;
