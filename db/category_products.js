const client = require('./client');

async function addProductToCategory({categoryId, productId}) {
	try {
		const { rows: [categoryProduct]} = await client.query(`
			INSERT INTO category_products("categoryId", "productId")
			VALUES($1, $2)
			RETURNING *;
		`, [categoryId, productId]);

		return categoryProduct;
	} catch(error) {
		throw error;
	}
}

async function getCategoryProduct(categoryId, productId) {
	try {
		const { rows: [categoryProduct]} = await client.query(`
			SELECT *
			FROM category_products
			WHERE "categoryId"=${categoryId} AND "productId"=${productId};
		`);
		return categoryProduct;
	} catch(error) {
		throw error;
	}
}

async function getAllCategoryProducts() {
	try {
		const { rows: categoryProducts} = await client.query(`
			SELECT *
			FROM category_products;
		`);
		return categoryProducts;
	} catch(error) {
		throw error;
	}
}
async function getCategoryProductById(id) {
	try {
		const { rows: [categoryProduct]} = await client.query(`
			SELECT *
			FROM category_products
			WHERE id=$id;
		`, [id]);
		return categoryProduct;
	} catch(error) {
		throw error;
	}
}

async function getCategoryProductsByCategory(categoryId) {
	try {
		const { rows: categoryProducts } = await client.query(`
			SELECT *
			FROM category_products
			JOIN products ON category_products."productId" = products.id
			WHERE "categoryId"=$1;
		`, [categoryId]);
		return categoryProducts;
	} catch(error) {
		throw error;
	}
}

async function getCategoryProductsByProduct(productId) {
	try {
		const { rows: categoryProducts} = await client.query(`
			SELECT *
			FROM category_products
			JOIN products ON category_products."productId" = products.id
			WHERE "productId"=$1;
		`, [productId]);
		return categoryProducts
	} catch(error) {
		throw error;
	}
}

async function updateCategoryProduct(id, categoryId, productId) {
	try {
		if(categoryId) {
			const {rows: [categoryProduct]} = await client.query(`
				UPDATE category_products
				SET "categoryId"=$2
				WHERE id=$1;
			`, [id, categoryId]);
		}
		if(productId) {
			const {rows: [categoryProduct]} = await client.query(`
				UPDATE category_products
				SET "productId"=$2
				WHERE id=$1;
			`, [id, productId]);
		}

		return getCategoryProductById(id);
	} catch(error) {
		throw error;
	}
}

async function deleteCategoryProduct(id) {
	try {
		const { rows: [categoryProduct]} = await client.query(`
			DELETE FROM category_products
			WHERE id=$1
			RETURNING *;
		`, [id]);

		return categoryProduct;
	} catch(error) {
		throw error;
	}
}

module.exports = {
	addProductToCategory,
	getCategoryProduct,
	getAllCategoryProducts,
	getCategoryProductById,
	getCategoryProductsByCategory,
	getCategoryProductsByProduct,
	updateCategoryProduct,
	deleteCategoryProduct
}