const client = require('./client');

async function createCategory(name) {
	try {
		const { rows: [category]} = await client.query(`
			INSERT INTO categories (name)
			VALUES ($1)
			ON CONFLICT (name) DO NOTHING
			RETURNING *;
		`, [name]);
		console.log('from db: ', name);
		return category;	
	} catch(error) {
		throw error;
	}
}

async function getAllCategories() {
	try {
		const { rows: categories } = await client.query(`
			SELECT *
			FROM categories;
		`);

		return categories;
	} catch(error) {
		throw error;
	}
}

async function getCategoryById(id) {
	try {
		const { rows: [category] } = await client.query(`
			SELECT *
			FROM categories
			WHERE id=$1;
		`, [id]);

		return category;
	} catch(error) {
		throw error;
	}
}

async function getCategoryByName(name) {
	try {
		const { rows: [category] } = await client.query(`
			SELECT *
			FROM categories
			WHERE name=$1;
		`, [name]);

		return category;
	} catch(error) {
		throw error;
	}
}
async function updateCategory(id, name) {
	try {
		const {rows: [category]} = await client.query(`
			UPDATE categories
			SET name=$2
			where id=$1
			RETURNING *;
		`, [id, name]);
		return getCategoryById(id);
	} catch(error) {
		throw error;
	}
}

async function deleteCategory(categoryId) {
	try {
		// await client.query(`
		// 	DELETE FROM category_products
		// 	WHERE "categoryId"=$1;
		// `, [id]);

		const { rows: [category]} = await client.query(`
			DELETE FROM categories
			WHERE id=$1;
		`, [categoryId]);

		return category;
	} catch(error) {
		throw error;
	}
}

module.exports = {
	createCategory,
	getAllCategories,
	getCategoryById,
	getCategoryByName,
	updateCategory,
	deleteCategory
}