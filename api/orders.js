const express = require('express');
const ordersRouter = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_SECRET } = process.env;
const {
    getOrdersByUserId,
    getOrderById,
    createOrder,
    updateOrder
} = require('../db');

ordersRouter.use((req, res, next) => {
    console.log("A request is being made to /orders");
    next();
});

ordersRouter.get('/:userId', async (req, res, next) => {
 const {userId} = req.params;
 try {
    const orders = await getOrdersByUserId(userId); 
    res.send(orders);
 } catch (error) {
     console.log(error);
     next(error);
 }
});

ordersRouter.get('/:userId/:orderId', async (req, res, next) => {
    const {orderId} = req.params;
    try {
       const order = await getOrderById(orderId); 
       res.send(order);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

ordersRouter.post('/:userId/createorder', async (req, res, next) => {
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

ordersRouter.patch('/:userId/:orderId', async (req, res, next) => {
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

module.exports = ordersRouter;