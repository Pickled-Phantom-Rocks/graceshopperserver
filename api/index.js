const express = require('express');
const apiRouter = express.Router();

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const { usersRouter } = require('./users')
apiRouter.use('/users', usersRouter)

const categoriesRouter = require('./categories');
apiRouter.use('/categories', categoriesRouter);

const { productsRouter } = require('./products')
apiRouter.use('/products', productsRouter)

const { cartsRouter } = require('./carts')
apiRouter.use('/carts', cartsRouter)

const { cartProductsRouter } = require('./cart_products')
apiRouter.use('/cart-products', cartProductsRouter)

const categoryProductsRouter = require('./category_products');
apiRouter.use('/category_products', categoryProductsRouter);

const ordersRouter = require('./orders');
apiRouter.use('/orders', ordersRouter);

apiRouter.use((error, req, res, next) => {
    res.send(error);
});

apiRouter.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send(err)
})


module.exports = apiRouter;