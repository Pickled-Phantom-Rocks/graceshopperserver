module.exports = {
	...require('./users'),
	...require('./products'),
	...require('./categories'),
	...require('./category_products'),
	...require('./carts'),
	...require('./cart_products'),
	...require('./orders'),
	...require('./order_products')
  }
