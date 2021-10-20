const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const categoriesRouter = express.Router();

const {
	createCategory,
	getAllCategories,
	getCategoryById,
	getCategoryByName,
	updateCategory,
	deleteCategory
} = require('../db/categories');
const { 
	getCategoryProductsByCategory, 
	addProductToCategory 
} = require('../db/category_products');

categoriesRouter.use((req, res, next) => {
	console.log("A request is being made to /categories");
    next(); 
});

categoriesRouter.get('/', async (req, res, next) => {
	try {
		const categories = await getAllCategories();
		res.send(categories);
	} catch(error) {
		next(error);
	}
});

categoriesRouter.post('/', async (req, res, next) => {
	try {
		const {name} = req.body;
		const existingCategory = await getCategoryByName(name);

		if(!existingCategory){
			const newCategory = await createCategory(name);
			res.send(newCategory);			
		} else {
			next({
				name: "Already Exists",
				message: "This category already exists.",
			})
		}
	} catch(error) {
		next(error);
	}
});

categoriesRouter.patch('/:categoryId', async (req, res, next) => {
	try {
		const id = req.params.categoryId;
		const {name} = req.body;
		const categoryToUpdate = await getCategoryById(id);

		if(categoryToUpdate) {
			const updatedCategory = await updateCategory(id, name);
			res.send(updatedCategory);
		} else {
			next({
				name: "Not Found",
				message: "This category does not exist.",
			});
		}
	} catch(error) {
		next(error);
	}
});

categoriesRouter.delete('/:categoryId', async (req, res, next) => {
	try {
		const id = req.params.categoryId;
		const categoryToDelete = await getCategoryById(id);

		if(categoryToDelete){
			const deletedCategory = await deleteCategory(id);
			res.send(deletedCategory);
		} else {
			next({
				name: "Not Found",
				message: "This category does not exist.",
			});
		}
	} catch(error) {
		next(error);
	}
});

categoriesRouter.post('/:categoryId/products', async (req, res, next) => {
	try {
		const {productId} = req.body;
		const {categoryId} = req.params;

		const foundCategoryProducts = await getCategoryProductsByCategory(categoryId);
		const existingCategoryProducts = foundCategoryProducts
			&& foundCategoryProducts.filter(categoryProduct => categoryProduct.productId === productId);

		if(existingCategoryProducts && existingCategoryProducts.length) {
			res.status(401)
			next({
				name: "Already Exists",
				message: "That product already exists in the category."
			})
		} else {
			const createdCategoryProduct = await addProductToCategory({categoryId, productId});
			if(createdCategoryProduct) {
				res.send(createdCategoryProduct);
			} else (
				next({
					name: "Addition Failed",
					message: "Unable to add this product to the category."
				})
			)
		}
	} catch(error){
		next(error);
	}
})

module.exports = categoriesRouter;