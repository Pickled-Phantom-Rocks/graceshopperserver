const client = require('./client');
const { getCartById } = require('./carts');

async function addProductToCart ({ cartId, productId, productPrice, quantityOfItem }) {
    try {
		const { rows: [cart_product]} = await client.query(`
			INSERT INTO cart_products("cartId", "productId", "productPrice", "quantityOfItem")
			VALUES($1, $2, $3, $4)
			RETURNING *;
		`, [cartId, productId, productPrice, quantityOfItem]);
        console.log("addProductToCart", cart_product);
		return cart_product;
    } catch (error) {
        throw error;
    }
}

async function getCart_ProductById(id) {
	try {
		const { rows: [cart_product]} = await client.query(`
			SELECT *
			FROM cart_products
			WHERE id=$1;
		`, [id]);
        console.log("getCart_ProductById in db", cart_product);
		return cart_product;
	} catch(error) {
		throw error;
	}
}

async function getCart_ProductByCartId(cartId) {
    try {
		const { rows: [cart_product]} = await client.query(`
			SELECT *
			FROM cart_products
			WHERE "cartId"=$1;
		`, [cartId]);
        console.log("product inside cart By cartId:", cart_product );
		return cart_product;
	} catch(error) {
		throw error;
	}
}

async function updateCart_Product ({ id, ...fields}) {
        const setString = Object.keys(fields).map(
          (key, index) => `"${ key }"=$${ index + 1 }`
        ).join(', ');
      
        if (setString.length === 0) {
          return;
        }
      
        try {
          const { rows: [ cart_product ]} = await client.query(`
            UPDATE cart_products
            SET ${ setString }
            WHERE id=${id}
            RETURNING *;
          `, Object.values(fields));
          console.log("UPDATE in db, updated cart product:", cart_product);
          return cart_product;
      
        } catch (error) {
          throw error;
        }
      };

async function deleteCart_Product (id) {
    try {
		const { rows: [cart_product]} = await client.query(`
			DELETE FROM cart_products
			WHERE id=$1
			RETURNING *;
		`, [id]);
        console.log("DELETE in db, deleted cart_product", cart_product);
		return cart_product;
	} catch(error) {
		throw error;
	}
}

async function canEditCart_Product (cart_productId, uId) {
    try {
        const cart_product = await getCart_ProductById(cart_productId);
        const cart = await getCartById(cart_product.cartId);
        console.log("canEditCart_Product, the following should be a cart:", cart);
        console.log("UserId should be a property of cart:", cart.userId);
        return cart.userId === uId;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    addProductToCart,
    getCart_ProductById,
    getCart_ProductByCartId,
    updateCart_Product,
    deleteCart_Product,
    canEditCart_Product

};