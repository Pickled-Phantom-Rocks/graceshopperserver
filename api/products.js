const express = require('express')
const productsRouter = express.Router()
const { createProducts, getAllProducts, getProductByName, getProductById, updateProduct, deleteProduct } = require('../db')

productsRouter.use((req, res, next) => {
    try {
        console.log("A request has been made to the /products route!")

        next()
    } catch (error) {
        throw error
    }
})

productsRouter.get('/', async (req, res, next) => {
    try {
        const products = await getAllProducts();
        res.send(products);
    } catch (error) {
        throw error
    }
})

productsRouter.get('/:productId', async (req, res, next) => {
    try {
        const {productId} = req.params;
        const product = await getProductById(productId)
        res.send(product)
    } catch (error) {
        throw error
    }
})

productsRouter.post('/', async (req, res, next) => {
    try {
            const product = req.body;
            const createdProduct = await createProducts(product);
            if(createdProduct){
                res.send({
                    status: 204,
                    message: "Product successfully created."
                })
            } else {
                res.send({
                    name: "Duplication Error",
                    message: "This product already exists."
                })
            }
    } catch (error) {
        throw error
    }
})

productsRouter.patch('/:productId', async (req, res, next) => {;
    try {
        const { productId } = req.params;
        const { fields } = req.body;
        const {name, desc, quantityAvailable, price, photoName} = fields;
        const existingProduct = await getProductByName(name);
        if(typeof(existingProduct) === 'object') {
            return res.status(400).send({
                message: "A product with this name already exists."
            })
        }

        const updateFields = {}
        if(fields.name){
            updateFields.name = fields.name;
        }
        if(fields.desc){
            updateFields.description = fields.desc;
        }
        if(fields.quantity){
            updateFields.quantityAvailable = fields.quantity;
        }
        if(fields.price){
            updateFields.price = fields.price;
        }
        if(fields.photo){
            updateFields.photoName = fields.photo;
        }
        const updated = await updateProduct(productId, updateFields);
        if(updated){
            res.send({
                status: 204,
                message: "Product successfully updated."
            })
        } else {
            res.send({
                name: "Duplication Error",
                message: "A product with this name already exists."
            })
        }
    } catch (error) {
        throw error
    }
})

productsRouter.delete('/:productId', async (req, res, next) => {
    try {
        const productId = req.params
        await deleteProduct(productId);
        res.send({
            status:204,
            message: "Product successfully deleted."
        })
    } catch (error) {
        throw error
    }
})


module.exports = {
    productsRouter
}