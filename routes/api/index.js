const router = require('express').Router();
const pizzaRoutes = require('./pizza-routes.js');
const commentRoutes = require('./comment-routes.js');

router.use('/comments', commentRoutes);
//add prefix of '/pizzas' to routes creates in 'pizza-routes.js'
router.use('/pizzas', pizzaRoutes);

module.exports = router;