const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const categoryProductsRouter = express.Router();

const {
	getCategoryProduct,
	getAllCategoryProducts,
	getCategoryProductsByCategory,
	getCategoryProductsByProduct,
	updateCategoryProduct,
	deleteCategoryProduct,
	addProductToCategory
} = require('../db/category_products');

categoryProductsRouter.use((req, res, next) => {
	console.log("A request is being made to /category_products");
    next(); 
});

categoryProductsRouter.get('/', async (req, res, next) => {
	try {
		const categoryProducts = await getAllCategoryProducts();
		res.send(categoryProducts);
	} catch(error) {
		next(error);
	}
})

categoryProductsRouter.get('/:productId', async (req, res, next) => {
	try {
		const {productId} = req.params;
		const productCategories = await getCategoryProductsByProduct(productId);
		res.send(productCategories);
	} catch(error) {
		next(error);
	}
})

categoryProductsRouter.get('/category/:categoryId', async (req, res, next) => {
	try	{
		const {categoryId} = req.params;
		const categoryProducts = await getCategoryProductsByCategory(categoryId);
		res.send(categoryProducts);
	} catch(error) {
		next(error);
	}
})

categoryProductsRouter.get('/:categoryId/:productId', async (req, res, next) => {
	try {
		const {categoryId, productId} = req.params;
		const categoryProduct = await getCategoryProduct(categoryId, productId);
		console.log('from api: ', categoryProduct);
		if(categoryProduct){
			res.send(categoryProduct);
		} else {
			res.send({
				name: "Not Found",
				message: "This product is not in the category."
			});
		}
	} catch(error) {
		next(error);
	}
})

categoryProductsRouter.post('/:categoryId/products', async (req, res, next) => {
	try {
		const {categoryId} = req.params;
		const {productId} = req.body;
		const products = await getCategoryProductsByCategory(categoryId);
		if(products.length == 0) {
			console.log('products:',products);
			const result = addProductToCategory({categoryId, productId});
			res.send({
				status: 204,
				message: "Product successfully added to the category."
			})
		} else {
			products.map((product) => {
				if(product.productId == productId){
					res.send({
						name: "Duplication Error",
						message: "This product already exists in the category."
					})
				} else {
					const result = addProductToCategory({categoryId, productId});
					res.send({
						status: 204,
						message: "Product successfully added to the category."
					})
				}
			})
		}
	} catch(error){
		next(error);
	}
})

categoryProductsRouter.patch('/:categoryProductId', async (req, res, next) => {
	try {
		const {categoryProductId} = req.params;
		const {categoryId, productId} = req.body;
		const updatedCategoryProduct = await updateCategoryProduct({categoryId, productId});
		res.send(updatedCategoryProduct)
	} catch(error) {
		next(error);
	}
});

categoryProductsRouter.delete('/:categoryProductId', async (req, res, next) => {
	try {
		const {categoryProductId} = req.params;
		const deletedCategoryProduct = await deleteCategoryProduct(categoryProductId);
		if(deletedCategoryProduct){
			res.send({
				status: 204,
				message: "Product successfully removed from the category."
			})
		} else {
			res.send({
				name: "Not Found",
				message: "This product is not in the category."
			});
		}
	} catch(error) {
		next(error);
	}
});

module.exports = categoryProductsRouter;