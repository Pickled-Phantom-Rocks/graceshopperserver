const express = require('express')
const cartProductsRouter = express.Router()

const { deleteCart_Product, updateCart_Product, addProductToCart, getCart_ProductByCartId } = require('../db');


cartProductsRouter.use((req, res, next) => {
    try {
        console.log("A request has been made to the /cart_products route!")

        next()
    } catch (error) {
        throw error
    }
})

cartProductsRouter.get("/:cartId", async (req, res, next) => {
    const {cartId} = req.params
    try {
        const cartProduct = await getCart_ProductByCartId(cartId)
        res.send(cartProduct)
    } catch (error) {
        throw error
    }

})

cartProductsRouter.post('/:cartId', async (req, res, next) => {
    const { cartId } = req.params
    const { productId, productPrice, quantityOfItem } = req.body
        const productsToAdd = { cartId, productId, productPrice, quantityOfItem }    
    try {
        const addedProducts = await addProductToCart(productsToAdd)
        res.send(addedProducts)
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
    } catch (error) {
        throw error
    }
})

cartProductsRouter.delete('/:productId', async (req, res, next) => {
    const {productId} = req.params
    try {
        const removedProduct = await deleteCart_Product(productId);
        res.send(removedProduct);

    } catch (error) {
        throw error
    }
})

module.exports = {
    cartProductsRouter
}