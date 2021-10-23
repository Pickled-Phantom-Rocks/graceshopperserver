const client = require('./client');
const { getUserById } = require('./users');

async function createOrder({
    userId,
    orderDate,
    deliveryDate,
    totalPrice
}) {
    try {
        const { rows: [order] } = await client.query(`
            INSERT INTO orders( "userId", "orderDate", "deliveryDate", "totalPrice") 
            VALUES($1, $2, $3, $4) 
            RETURNING id, "userId", "orderDate", "deliveryDate", "totalPrice";
      `, [userId, orderDate, deliveryDate, totalPrice]);
        console.log("!!CREATE ORDER!!", order);
        return order;
    } catch (error) {
        throw error;
    }
}

async function getOrdersByUserId( userId ) {
    if(!userId){
        return;
    }
    try {
        const { rows: orders } = await client.query( `
            SELECT *
            FROM orders
            WHERE "userId" = ${userId}
        `);
        console.log("!!GetOrderByUserID!!", orders);
        return orders;
    } catch (error) {
        throw error;
    }
}

async function getOrderById(orderId) {
    try {
        const { rows: [order] } = await client.query(`
            SELECT *
            FROM orders
            WHERE id = ${orderId}
      `);

        if (!order) {
            return null
        }
        console.log("GetOrderByID", order);
        return order;
    } catch (error) {
        throw error;
    }
};

async function updateOrder({ id, ...fields }) {
    const setString = Object.keys(fields).map(
        (key, index) => `"${key}"=$${index + 1}`
    ).join(', ');

    if (setString.length === 0) {
        return;
    }

    try {
        const { rows: [order] } = await client.query(`
            UPDATE orders
            SET ${setString}
            WHERE id=${id}
            RETURNING *;
        `, Object.values(fields));
        console.log("UPDATE Order!!!!!!", order);
        return order;

    } catch (error) {
        throw error;
    }
}

async function deleteOrder (orderId) {
    try {
        const { rows: [orderToDelete]} = await client.query(`
            DELETE FROM orders
            WHERE id=$1
            RETURNING *;
        `, [orderId])
        return orderToDelete;
    } catch (e) {
        throw e;
    }
}

async function getAllOrders () {
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM orders;
        `);
        return rows;
    } catch (e) {
        throw e;
    }
}

module.exports = {
    createOrder,
    getOrdersByUserId,
    getOrderById,
    updateOrder,
    deleteOrder,
    getAllOrders
}