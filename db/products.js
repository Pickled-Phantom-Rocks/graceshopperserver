const client = require('./client')
const utils = require('./utils')

async function createProducts({name, description, quantityAvailable, price, photoName}) {

    try {

        const { rows: [ products ] } = await client.query(`
            INSERT INTO products(name, description, "quantityAvailable", price, "photoName")
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (name) DO NOTHING
            RETURNING *;
        `, [name, description, quantityAvailable, price, photoName])

        return products

    } catch (error) {
        throw error
    }

}

async function getAllProducts() {
    try {
        const { rows: products } = await client.query(`
            SELECT *
            FROM products;
        `)
        return products;
    } catch (error) {
        throw error
    }
}

async function getProductById(productId) {

    try {

        const { rows: product } = await client.query(`
            SELECT *
            FROM products
            WHERE id=$1;
        `, [productId])

        console.log("GetProductById: ", product, "productID that was passed in: ", productId)
        return product

    } catch (error) {
        throw error
    }

}

async function getProductByCategory(category) {

    try {

    } catch (error) {
        throw error
    }

}

async function updateProduct({ id, ...fields}) {

    try {

        const toUpdate = {}

        for (let column in fields) {
            if (fields[column] !== undefined) toUpdate[column] = fields[column]
        }

        let product

        if (utils.dbFields(fields).insert.length > 0) {
            const { rows } = await client.query(`
                UPDATE products
                SET ${utils.dbFields(toUpdate).insert}
                WHERE id=${id}
                RETURNING *;
            `, Object.values(toUpdate))
            product = rows[0]

            console.log("UpdatedProduct: ", product)
            return product
        }

    } catch (error) {
        throw error
    }

}

async function deleteProductById({productId}) {

    try {

        const { rows: product } = await client.query(`
            DELETE * 
            FROM products
            WHERE id=$1
            RETURNING *;
        `, [productId])

        console.log("DeletedProduct: ", product)
        return product

    } catch (error) {
        throw error
    }

}




module.exports = {
    createProducts,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProductById
}