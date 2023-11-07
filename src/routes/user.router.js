const router = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  disabledUser,
  activeUser
} = require('../controllers/user.controller');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

//router.delete('/:id', authenticate, authorize(['admin']), disabledUser);

router.get('/', getUsers);
router.get('/:id',  getUserById);
router.post('/',  createUser);
router.put('/:id',  updateUser);
router.delete('/:id',  disabledUser);
router.patch('/:id',  activeUser);

module.exports = router;
