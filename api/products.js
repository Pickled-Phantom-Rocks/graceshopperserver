const express = require('express')
const productsRouter = express.Router()
const { createProducts, getAllProducts, getProductById, updateProduct, deleteProductById } = require('../db')

productsRouter.use((req, res, next) => {
    try {
        console.log("A request has been made to the /products route!")

        next()
    } catch (error) {
        throw error
    }
})

productsRouter.get('/', async (req, res, next) => {
    try {//get all the products

        const products = await getAllProducts();

        res.send(products);

    } catch (error) {
        throw error
    }
})

productsRouter.get('/:productId', async (req, res, next) => {
    try {//get product by Id

        const {productId} = req.params

        const product = await getProductById(productId)

        res.send(product)

    } catch (error) {
        throw error
    }
})

productsRouter.get('/:category', async (req, res, next) => {
    try {

    } catch (error) {
        throw error
    }
})

productsRouter.post('/', async (req, res, next) => {
    try {//Create a product 

        const isAdmin = true

        if (isAdmin) {
            const product = req.body

            const createdProduct = await createProducts(product)
    
            res.send(createdProduct)
        } else if (!isAdmin) {
            res.status(401)

            next({ name: "Unauthorized!", message: "You must be an admin for this action!"})
        }

    } catch (error) {
        throw error
    }
})

productsRouter.patch('/:productId', async (req, res, next) => {

    const { productId } = req.params
    const { name, description, quantityAvailable, price, photoName } = req.body

    const updateFields = {}

    if(name) {
        updateFields.name = name
    }

    if (description) {
        updateFields.description = description
    }

    if (quantityAvailable) {
        updateFields.quantityAvailable = quantityAvailable
    }

    if (price) {
        updateFields.price = price
    } 

    if (photoName) {
        updateFields.photoName = photoName
    }

    try {//edit product info

        const isAdmin = true

        if (isAdmin) {
            const updatedProduct = await updateProduct(productId, updateFields)
            res.send({ product: updatedProduct })
        } else if (!isAdmin) {
            res.status(401)

            next({ name: "Unauthorized!", message: "You must be an admin for this action!"})
        }

    } catch (error) {
        throw error
    }
})

productsRouter.delete('/:productId', async (req, res, next) => {
    try {//Delete the product matching the productId

        const productId = req.params

        const deletedProduct = await deleteProductById(productId)
        res.send(deletedProduct)

    } catch (error) {
        throw error
    }
})


module.exports = {
    productsRouter
}