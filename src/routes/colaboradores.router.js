const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUser,
  disabledUser,
  activeUser,
  getInforme,
} = require('../controllers/colaboradores.controller');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

router.get('/', getUsers);
router.get('/:id', getUserById);
router.patch('/:id', updateUser);
router.delete('/:id', disabledUser);
router.patch('/activate/:id', activeUser);
router.get('/informe/:option', getInforme);

module.exports = router;
