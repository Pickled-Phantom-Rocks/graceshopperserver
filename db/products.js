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

async function attachProductsToCarts(carts) {
    const cartsToReturn = [...carts]
    const binds = carts.map((_, index) => `$${index + 1}`).join(', ')
    const cartIds = carts.map(cart => cart.id)
    if(!cartIds?.length) return

    try{

        const { rows: products } = await client.query(`
            SELECT products.*, cart_products."cartId", cart_products."productPrice", cart_products."quantityOfItem", cart_products.id AS "cartProductsId"
            FROM products
            JOIN cart_products
            ON cart_products."productId" = products.id
            WHERE cart_products."cartId" IN (${ binds });
        `, cartIds)

        for (const cart of cartsToReturn) {
            const productsToAdd = products.filter(product => product.cartId === cart.id)
            cart.products = productsToAdd
        }

        return cartsToReturn
    } catch(error) {
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
        const { rows: [product] } = await client.query(`
            SELECT *
            FROM products
            WHERE id=$1;
        `, [productId]);
        return product;
    } catch (error) {
        throw error
    }
}

async function getProductByName(name){
    try {
        const {rows: [product]} = await client.query(`
            SELECT *
            FROM products
            WHERE name=$1;
        `, [name]);
        return product;
    } catch(error) {
        throw error
    }
}

async function updateProduct(id, fields) {
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
    
    if (setString.length === 0) {
        return;
    }
    try {
        const {rows: [product]} = await client.query(`
            UPDATE products
            SET ${setString}
            WHERE id=${id}
            RETURNING *;
        `, Object.values(fields))
        return product
    } catch (error) {
        console.log(error);
        throw error
    }
}

async function deleteProduct({productId}) {
    try {
        const { rows: [product] } = await client.query(`
            DELETE FROM products
            WHERE id=$1;
        `, [productId])
        return product

    } catch (error) {
        throw error
    }
}




module.exports = {
    createProducts,
    getAllProducts,
    getProductByName,
    getProductById,
    updateProduct,
    deleteProduct,
    attachProductsToCarts
}