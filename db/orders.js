const client = require('./client');
const { getUserById } = require('./users');

async function createOrder({
    userId,
    orderDate,
    deliveryDate,
    totalPrice,
    orderStatus
}) {
    try {
        const { rows: [order] } = await client.query(`
            INSERT INTO orders( "userId", "orderDate", "deliveryDate", "totalPrice", "orderStatus") 
            VALUES($1, $2, $3, $4, $5) 
            RETURNING *;
      `, [userId, orderDate, deliveryDate, totalPrice, orderStatus]);
        return order;
    } catch (error) {
        throw error;
    }
}

async function getOrderById(orderId) {
    try {
        const { rows: [order] } = await client.query(`
            SELECT *
            FROM orders
            WHERE id = ${orderId};
      `);

        if (!order) {
            return null
        }
        console.log("GetOrderByID:", order);
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
        console.log("UPDATE Order:", order);
        return order;

    } catch (error) {
        throw error;
    }
}

async function deleteOrder (orderId) {
    try {
        await client.query(`
            DELETE FROM order_products
            WHERE "orderId"=$1
        `, [orderId]);

        const { rows: [orderToDelete]} = await client.query(`
            DELETE FROM orders
            WHERE id=$1
            RETURNING *;
        `, [orderId]);


        return orderToDelete;
    } catch (e) {
        throw e;
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
            WHERE "userId" = ${userId};
        `);
        console.log("GetOrderByUserID:", orders);
        return orders;
    } catch (error) {
        throw error;
    }
}

async function getAllOrders() {
    try {
    const { rows: orders } = await client.query(`
        SELECT *
        FROM orders;
     `) 
    for (const order of orders) {
        const { rows: orderProducts } = await client.query(`
            SELECT *
            FROM order_products
            WHERE order_products."orderId" = $1;
        `, [order.id]);
            order.orderProducts = orderProducts;
        }
        console.log("IS THIS RUNNING!!!! TEST TEST TEST TEST TEST")
        return orders;
    } catch (error) {
        throw error;
    }
}

async function getAllOrdersByUserId( userId ) {
    try {
    const { rows: orders } = await client.query(`
        SELECT *
        FROM orders
        WHERE "userId"=$1;
     `, [userId]); 

    for (const order of orders) {
        const { rows: orderProducts } = await client.query(`
            SELECT *
            FROM order_products
            WHERE order_products."orderId" = $1;
        `, [order.id]);
            order.orderProducts = orderProducts;
        }
        return orders;
    } catch (error) {
        throw error;
    }
}

async function getAllOrdersWithUsers() {
    try {
        const { rows: orders } = await client.query(`
        SELECT *
        FROM orders;
     `) 
     for (const order of orders) {
        const { rows: orderProducts } = await client.query(`
            SELECT *
            FROM order_products
            WHERE order_products."orderId" = $1;
        `, [order.id]);
            order.orderProducts = orderProducts;
        }
    for (const order of orders) {
        const { rows: [user] } = await client.query(`
            SELECT *
            FROM users
            WHERE users.id = $1;
        `, [order.userId]);
            order.owner = user;
            delete order.owner.password;
            delete order.owner.billingInfo;    
        }
        
        return orders;
    } catch (error) {
        throw error;
    }
}

async function getOrdersByStatus(orderStatus) {
    try {
        const { rows: orders } = await client.query(`
            SELECT *
            FROM orders
            WHERE "orderStatus"=$1;
        `, [orderStatus]);
        console.log("getOrdersByStatus:", orders);
        for (const order of orders) {
            const { rows: orderProducts } = await client.query(`
                SELECT *
                FROM order_products
                WHERE order_products."orderId" = $1;
            `, [order.id]);
                order.orderProducts = orderProducts;
            }
        for (const order of orders) {
            const { rows: [user] } = await client.query(`
                SELECT *
                FROM users
                WHERE users.id = $1;
            `, [order.userId]);
                order.owner = user;
                delete order.owner.password;
                delete order.owner.billingInfo;    
            }
        return orders;
    } catch (error) {
        throw error;
    }
}

async function updateOrderStatus(id, orderStatus) {
    try {
        const { rows: [order] } = await client.query(`
            UPDATE orders
            SET "orderStatus"=$1
            WHERE id=${id}
            RETURNING *;
        `, [orderStatus]);
        
        return order;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createOrder,
    getOrdersByUserId,
    getOrderById,
    updateOrder,
    deleteOrder,
    getAllOrders,
    getAllOrdersByUserId,
    getOrdersByStatus,
    updateOrderStatus,
    getAllOrdersWithUsers
}