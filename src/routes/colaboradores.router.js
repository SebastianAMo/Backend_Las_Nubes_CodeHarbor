const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUser,
  disabledUser,
  activeUser
} = require('../controllers/colaboradores.controller');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

//router.delete('/:id', authenticate, authorize(['admin']), disabledUser);

router.get('/', getUsers);
router.get('/:id',  getUserById);
router.patch('/:id',  updateUser);
router.delete('/:id',  disabledUser);
router.patch('/activate/:id',  activeUser);

module.exports = router;
