const express = require('express');
const { deleteOrder } = require('../db');
const orderProductsRouter = express.Router();

const {    
    createOrder_Product,
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

orderProductsRouter.patch('/:order_productId', async (req, res, next) => {
    const {order_productId} = req.params;
    const {orderId, productId, cartProductsId, quantityOrdered, priceWhenOrdered} = req.body;

    const order_ProductToUpdate = {};
    orderToUpdate.id = order_productId;
    if (orderId) {
        orderToUpdate.orderId = orderId;
    }
    if (productId) {
        orderToUpdate.productId = productId;
    }
    if (cartProductsId) {
        orderToUpdate.cartProductsId = cartProductsId;
    }
    if (quantityOrdered) {
        orderToUpdate.quantityOrdered = quantityOrdered;
    }
    if (priceWhenOrdered) {
        orderToUpdate.priceWhenOrdered = priceWhenOrdered;
    }
    try {
       const updatedOrder = await updateOrder_Product(orderToUpdate); 
       res.send(updatedOrder);
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