const express = require('express')
const cartsRouter = express.Router()
const { createCarts, getAllCarts, getCartByUserId, updateCart, destroyCart } = require('../db')

cartsRouter.use((req, res, next) => {
    try {
        console.log("A request has been made to the /carts route!")

        next()
    } catch (error) {
        throw error
    }
})

cartsRouter.get('/', async (req, res, next) => {
    try { //gets all open/active carts, only accessible to admin for order fulfillment 

        const activeCarts = await getAllCarts()

        res.send(activeCarts)

    } catch (error) {
        throw error
    }
})

cartsRouter.get('/:userId', async (req, res, next) => {
    try{ //gets a cart using userId

        const {userId} = req.params

        const cart = await getCartByUserId(userId)

        res.send(cart)

    } catch (error) {
        throw error
    }
})


cartsRouter.post('/:userId', async (req, res, next) => {
    try {//creates a new cart for a user

        const userId = req.params.userId

        const age = 0
        const isActive = true
        const cartData = { userId, age, isActive }

        const createdCart = await createCarts(cartData)

        res.send(createdCart)

    } catch (error) {
        throw error
    }
})

cartsRouter.patch('/:userId', async (req, res, next) => {

    const {userId} = req.params
    const {age, isActive} = req.body

    const updateFields = {}

    if (age) {
        updateFields.age = age
    }

    if (isActive) {
        updateFields.isActive = isActive
    }

    try {//edit cart matching userId

        const isAdmin = true

        if(isAdmin) {
            const updatedCart = await updateCart({userId, updateFields})
            res.send({ cart: updatedCart })
        } else if (!isAdmin) {
            res.status(400)

            next({ name: "Unauthorized!", message: "You must be an admin for this action!"})
        }

    } catch (error) {
        throw error
    }
})

cartsRouter.delete('/:userId', async (req, res, next) => {
    const {userId} = req.params;
    try {
        const destroyedCart = await destroyCart(userId);
        res.send(destroyedCart);
    } catch (error) {
        throw error
    }
})

module.exports = {cartsRouter};