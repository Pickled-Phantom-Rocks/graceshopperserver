const express = require('express')
const cartProductsRouter = express.Router()

const { deleteCart_Product, updateCart_Product } = require('../db');


cartProductsRouter.use((req, res, next) => {
    try {
        console.log("A request has been made to the /cart_products route!")

        next()
    } catch (error) {
        throw error
    }
})

cartProductsRouter.patch('/:cart_productId', async (req, res, next) => {

    const {cart_productId} = req.params;
    const { cartId, productId, productPrice, quantityOfItem } = req.body;
    const cart_ProductToUpdate = {};
    cart_ProductToUpdate.id = cart_productId;

    if (cartId) {
        cart_ProductToUpdate.cartId = cartId;
    }
    if (productId) {
        cart_ProductToUpdate.productId = productId;
    }
    if (productPrice) {
        cart_ProductToUpdate.productPrice = productPrice;
    }
    if (quantityOfItem) {
        cart_ProductToUpdate.quantityOfItem = quantityOfItem;
    }

    try {
       const updatedCart_Product = await updateCart_Product(cart_ProductToUpdate); 
       res.send(updatedCart_Product);

        console.log("CartId passed into carProductsPost: ", cartId)
        console.log("Req Body from cartProductsPost: ", req.body)
    } catch (error) {
        throw error
    }
})

cartProductsRouter.delete('/:cart_productId', async (req, res, next) => {

    const {cart_productId} = req.params

    try {//delete a cart_product
        const cartToDelete = await deleteCart_Product(cart_productId);
        res.send(cartToDelete);

    } catch (error) {
        throw error
    }
})



module.exports = {
    cartProductsRouter
}