const { attachProductsToCarts } = require('./products')
const client = require('./client')
const utils = require('./utils')

async function createCarts({userId, age, isActive}) {

    try {

        const { rows: [ carts ] } = await client.query(`
            INSERT INTO carts("userId", age, "isActive")
            VALUES ($1, $2, $3)
            RETURNING *;
        `, [userId, age, isActive])

        return carts

    } catch (error) {
        throw error;
    }

}

async function getAllCarts() {
    try {
        const { rows: carts } = await client.query(`
            SELECT carts.*, users.name AS "cartOwner"
            FROM carts
            JOIN users
            ON carts."userId"=users.id;
        `)
        //console.log("Is this working?")
        //console.log("The carts: ", carts)
        const cartsWithProducts = await attachProductsToCarts(carts)
        //console.log("Carts with products", cartsWithProducts)

        return cartsWithProducts
    } catch (error) {
        throw error
    }
}

async function getAllActiveCarts() {
    try {

        const { rows: [ carts ] } = await client.query(`
            SELECT *
            FROM carts
            WHERE "isActive"=true;
        `)

        return carts
        
    } catch (error) {
        throw error
    }
}

async function getCartById({id}) {
    try {

        const { rows: [ cart ] } = await client.query(`
            SELECT *
            FROM carts
            WHERE id=$1
        `, [id])

        return cart

    } catch (error) {
        throw error
    }
}

async function getCartByUserId(userId) {
    try {

        const { rows: cart } = await client.query(`
            SELECT *
            FROM carts
            WHERE "userId"=$1;
        `, [userId])

        const cartsWithProducts = await attachProductsToCarts(cart)

        return cartsWithProducts

    } catch (error) {
        console.log("Error with GetCartByUserId")
        throw error
    }
}

async function updateCart({ userId, ...fields}) {
    try {

        const toUpdate = {}

        for (let column in fields) {
            if(fields[column] !== undefined) toUpdate[column] = fields[column]
        }

        let cart
        
        if (utils.dbFields(fields).insert.length > 0) {
            const { rows } = await client.query(`
                UPDATE carts
                SET ${utils.dbFields(toUpdate).insert}
                WHERE "userId"=${userId}
            `, Object.values(toUpdate))

            cart = rows[0]

            return cart
        }

    } catch (error) {
        throw error
    }
}

async function destroyCart(userId) {
    try {
        const cart = getCartByUserId(userId);
        const cartID = cart.id;
        
        await client.query(`
            DELETE from cart_products
            WHERE "cartId"=$1;
        `, [cartID]);

        const { rows: [cart] } = await client.query(`
            DELETE FROM carts
            WHERE "userId"=$1;
        `, [userId])

        return cart;

    } catch (error) {
        throw error
    }
}


module.exports = {
    createCarts,
    getAllActiveCarts,
    getCartByUserId,
    destroyCart,
    updateCart,
    getCartById,
    getAllCarts
}