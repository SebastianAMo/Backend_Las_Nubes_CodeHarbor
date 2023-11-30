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

router.get('/', authenticate, getUsers);
router.get('/:id', authenticate, getUserById);
router.patch('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, disabledUser);
router.patch('/activate/:id', authenticate, activeUser);
router.get('/informe/:option', authenticate, getInforme);

module.exports = router;
