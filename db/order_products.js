const client = require('./client');

async function createOrder_Product({ orderId, productId, quantityOrdered, priceWhenOrdered, name, description, photoName }) {
    try {
		const { rows: [order_product]} = await client.query(`
			INSERT INTO order_products("orderId", "productId", "quantityOrdered", "priceWhenOrdered", name, description, "photoName")
			VALUES($1, $2, $3, $4, $5, $6, $7)
			RETURNING *;
		`, [orderId, productId, quantityOrdered, priceWhenOrdered, name, description, photoName]);
        console.log("CreateOrderProduct:", order_product);
		return order_product;
    } catch (error) {
        throw error;
    }
}

async function getAllOrderProducts() {
    try {
        const { rows: orderProducts} = await client.query(`
			SELECT *
			FROM order_products;
		`);
		return orderProducts;
    }catch(error){
        throw error;
    }
}

async function getOrder_ProductById(id) {
	try {
		const { rows: [order_product]} = await client.query(`
			SELECT *
			FROM order_products
			WHERE id=$1;
		`, [id]);
        console.log("GET ORDER_PRODUCT BY ID:", order_product);
		return order_product;
	} catch(error) {
		throw error;
	}
}

async function getOrder_ProductsByOrderId(orderId) {
    try {
		const { rows: [order_product]} = await client.query(`
			SELECT *
			FROM order_products
			WHERE "orderId"=$1;
		`, [orderId]);
        console.log("getOrder_ProductSBy Order Id:", order_product);
		return order_product;
	} catch(error) {
		throw error;
	}
}

async function updateOrder_Product ({ id, ...fields}) {
        const setString = Object.keys(fields).map(
          (key, index) => `"${ key }"=$${ index + 1 }`
        ).join(', ');
      
        if (setString.length === 0) {
          return;
        }
      
    try {
        const { rows: [ order_product ]} = await client.query(`
            UPDATE order_products
            SET ${ setString }
            WHERE id=${id}
            RETURNING *;
            `, Object.values(fields));
            console.log("UDPATE Order_Product DB:", order_product);
        return order_product;
      
    } catch (error) {
        throw error;
    }
    };

async function deleteOrder_Product (id) {
    try {
		const { rows: [order_product]} = await client.query(`
			DELETE FROM order_products
			WHERE id=$1
			RETURNING *;
		`, [id]);
        console.log("DELETE: Order_Product DB", order_product);
		return order_product;
	} catch(error) {
		throw error;
	}
}

async function getAllCartProducts () {
    try {
        const { rows: cartProducts} = await client.query(`
            SELECT *
            FROM cart_products;
        `)
        console.log(cartProducts);
        return cartProducts;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    createOrder_Product,
    getAllOrderProducts,
    getOrder_ProductById,
    getOrder_ProductsByOrderId,
    updateOrder_Product,
    deleteOrder_Product,
    getAllCartProducts
};