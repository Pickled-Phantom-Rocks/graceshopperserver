const express = require('express');
const ordersRouter = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_SECRET } = process.env;
const {
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    getAllOrders,
    getUserByUsername,
    getOrder_ProductsByOrderId,
    getAllOrdersByUserId,
    getProductById,
    updateOrderStatus,
    getOrdersByStatus,
    getUserById,
    getAllOrdersWithUsers
} = require('../db');

ordersRouter.use((req, res, next) => {
    console.log("A request is being made to /orders");
    next();
});

ordersRouter.get('/', async ( req, res, next) => {
    try {
        const allOrders = await getAllOrders();
        console.log(allOrders)
        res.send(allOrders);
    } catch (e) {
        next(e);
    }
})

ordersRouter.get('/:userId/pastorders', async (req, res, next) => {
 const {userId} = req.params;
 try {
    const orders = await getAllOrdersByUserId(userId); 
    console.log(orders);
    res.send(orders);
 } catch (error) {
     console.log(error);
     next(error);
 }
});

ordersRouter.get('/users', async (req, res, next) => {

    try {
       const ordersWithUsers = await getAllOrdersWithUsers(); 
       console.log(ordersWithUsers);
       res.send(ordersWithUsers);
    } catch (error) {
        console.log(error);
        next(error);
    }
   });

ordersRouter.get('/:orderId', async (req, res, next) => {
    const {orderId} = req.params;
    try {
       const order = await getOrderById(orderId); 
       res.send(order);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

ordersRouter.post('/:orderId/products', async (req, res, next) => {
    const { orderId } = req.params;
    const { quantityOrdered, priceWhenOrdered, productId } = req.body;

    try {
        if ( !quantityOrdered || !priceWhenOrdered || !productId) {
            res.send({
                name: "Information Required",
                message: "More information is needed to POST."
            })
        }
        const product = await getProductById(productId);
        const orderProductToMake = {};
        orderProductToMake.orderId = orderId;
        orderProductToMake.quantityOrdered = quantityOrdered;
        orderProductToMake.priceWhenOrdered = priceWhenOrdered;
        orderProductToMake.name = product.name;
        orderProductToMake.description = product.description;
        orderProductToMake.photoName = product.photoName;

        const newOrderProduct = await createOrder_Product(orderProductToMake);

        console.log("OrderId passed into orderProductsPost: ", orderId);
        console.log("Req Body from orderProductsPost: ", req.body);
        res.send(newOrderProduct);
    } catch (error) {
        next(error);
    }
})

ordersRouter.post('/:userId', async (req, res, next) => {
    const { orderDate, deliveryDate, totalPrice } = req.body;
    const { userId } = req.params;
    const order = { userId, orderDate, deliveryDate, totalPrice}; 
    try {
       const newOrder = await createOrder(order); 
       res.send(newOrder);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

ordersRouter.patch('/:orderId', async (req, res, next) => {
    const { orderId } = req.params;
    const { orderDate, deliveryDate, totalPrice } = req.body;
    const orderToUpdate = {};
    orderToUpdate.id = orderId;
    if (orderDate) {
        orderToUpdate.orderDate = orderDate;
    }
    if (deliveryDate) {
        orderToUpdate.deliveryDate = deliveryDate;
    }
    if (totalPrice) {
        orderToUpdate.totalPrice = totalPrice;
    }
    try {
       const updatedOrder = await updateOrder(orderToUpdate); 
       res.send(updatedOrder);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

ordersRouter.delete('/:orderId'), async ( req, res, next) => {
    const { orderId } = req.params;
    try {
        const orderToDelete = await deleteOrder(orderId);
        res.send(orderToDelete);
    } catch (e) {
        throw e;
    }
}

ordersRouter.patch('/:orderId/status', async (req, res, next) => {
    const { orderId } = req.params;
    const {orderStatus} = req.body;
    try {
        const updated = await updateOrderStatus(orderId, orderStatus);
        if(updated){
            res.send({
                status: 204,
                message: "Order status successfully changed."
            })
        }
    } catch(error) {
        next(error);
    }
})

ordersRouter.get('/:orderStatus/status', async (req, res, next) => {
    const {orderStatus} = req.params;
    try {
        const orders = await getOrdersByStatus(orderStatus);
        res.send(orders);
    } catch(error) {
        next(error);
    }
})

module.exports = ordersRouter;