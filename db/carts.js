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

    } catch (error) {
        throw error
    }
}

async function getCartByUserId({userId}) {
    try {

        const { rows: cart } = await client.query(`
            SELECT *
            FROM carts
            WHERE "userId"=$1;
        `, [userId])

        return cart

    } catch (error) {
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
    getCartById
}