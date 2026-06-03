const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { getCocktails, getCocktail, createCocktail, updateCocktail, deleteCocktail } = require('../controllers/cocktails');

router.get('/', getCocktails);
router.get('/:id', getCocktail);

router.post('/', requireAuth, requireRole('admin'), createCocktail);
router.put('/:id', requireAuth, requireRole('admin'), updateCocktail);
router.delete('/:id', requireAuth, requireRole('admin'), deleteCocktail);

module.exports = router;
