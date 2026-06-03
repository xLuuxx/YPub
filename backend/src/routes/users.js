const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/users');

router.use(requireAuth, requireRole('admin'));

router.get('/', getUsers);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
