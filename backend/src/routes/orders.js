const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { getOrders, getOrder, createOrder, updateOrder, deleteOrder } = require('../controllers/orders');

router.use(requireAuth);

router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/', createOrder);
router.patch('/:id', requireRole('admin', 'staff'), updateOrder);
router.delete('/:id', deleteOrder);

module.exports = router;
