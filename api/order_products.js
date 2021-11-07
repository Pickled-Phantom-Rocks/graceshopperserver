const express = require('express');
const { deleteOrder } = require('../db');
const orderProductsRouter = express.Router();

const {    
    createOrder_Product,
    getAllOrderProducts,
    getOrder_ProductById,
    getOrder_ProductsByOrderId,
    updateOrder_Product,
    deleteOrder_Product } = require('../db');

orderProductsRouter.use((req, res, next) => {
    try {
        console.log("A request has been made to the /cart_products route!")

        next()
    } catch (error) {
        throw error
    }
})

orderProductsRouter.get('/', async (req, res, next) => {
	try {
		const categoryProducts = await getAllOrderProducts();
		res.send(categoryProducts);
	} catch(error) {
		next(error);
	}
})

orderProductsRouter.get('/:order_productId', async (req, res, next) => {
    const orderProductId = req.params;
    try {
        const orderProduct = await getOrder_ProductById(orderProductId);
        res.send(orderProduct);
    } catch (error) {
        next(error);
    }
})

orderProductsRouter.get('/:orderId', async (req, res, next) => {
    const orderId = req.params
    try {
        const orderProducts = await getOrder_ProductsByOrderId(orderId);
        res.send(orderProducts);
    } catch (error) {
        next(error);
    }
})

orderProductsRouter.post('/:orderId', async (req, res, next) => {
    const result = await createOrder_Product(req.body);
    res.send(result);
})

orderProductsRouter.patch('/:order_productId', async (req, res, next) => {
    const {order_productId} = req.params;
    const {orderId, productId, quantityOrdered, priceWhenOrdered, name, description, price, photoName } = req.body;

    const order_ProductToUpdate = {};
    order_ProductToUpdate.id = order_productId;
    if (orderId) {
        order_ProductToUpdate.orderId = orderId;
    }
    if (productId) {
        order_ProductToUpdate.productId = productId;
    }
    if (quantityOrdered) {
        order_ProductToUpdate.quantityOrdered = quantityOrdered;
    }
    if (priceWhenOrdered) {
        order_ProductToUpdate.priceWhenOrdered = priceWhenOrdered;
    }
    if (name) {
        order_ProductToUpdate.name = name;
    }
    if (description) {
        order_ProductToUpdate.description = description;
    }
    if (price) {
        order_ProductToUpdate.price = price;
    }
    if (photoName) {
        order_ProductToUpdate.photoName = photoName;
    }
    try {
       const updatedOrder_Product = await updateOrder_Product(order_ProductToUpdate); 
       res.send(updatedOrder_Product);
    } catch (error) {
        next(error);
    }
})


orderProductsRouter.delete('/:orderProductsId', async (req, res, next) => {
    const orderProductsId = req.params;

    try {
        const destroyedOrderProduct = await deleteOrder_Product(orderProductsId);
        res.send(destroyedOrderProduct);
    } catch (error) {
        next(error);
    }
})

module.exports = {
    orderProductsRouter
}