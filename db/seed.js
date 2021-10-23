const client = require('./client'); 
const {
    createUser,
    createProducts,
    createCarts,
    createCategory,
    createOrder,
    getAllCarts,
    getAllProducts,
    addProductToCart
} = require('./')

async function dropTables() {
    try {
    console.log('Dropping All Tables...');
    client.query(`

    DROP TABLE IF EXISTS order_products;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS cart_products;
    DROP TABLE IF EXISTS carts;
    DROP TABLE IF EXISTS product_categories;
    DROP TABLE IF EXISTS categories;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;
    `);

    console.log('Finished dropping tables!');
    } catch (error) {
    console.error('Error while dropping tables!');

    throw error;
    }
}

async function createTables() {
    try {
    console.log("Starting to build tables...");

    await client.query(`

    CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255),
        city VARCHAR(255),
        state VARCHAR(255),
        "billingInfo" VARCHAR(255),
        "isAdmin" BOOL DEFAULT false
    );

    CREATE TABLE products(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description VARCHAR (255),
        "quantityAvailable" INTEGER DEFAULT 0,
        price DECIMAL NOT NULL,
        "photoName" VARCHAR(255)
    );

    CREATE TABLE carts(
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id),
        age INTEGER,
        "isActive" BOOLEAN DEFAULT true 
    );

    CREATE TABLE cart_products(
        id SERIAL PRIMARY KEY,
        "cartId" INTEGER REFERENCES carts(id),
        "productId" INTEGER REFERENCES products(id),
        "productPrice" DECIMAL NOT NULL,
        "quantityOfItem" INTEGER
    );

    CREATE TABLE orders(
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id),
        "orderDate" DATE NOT NULL,
        "deliveryDate" DATE DEFAULT NULL,
        "totalPrice" DECIMAL
    );

    CREATE TABLE order_products(
        id SERIAL PRIMARY KEY,
        "orderId" INTEGER REFERENCES orders(id),
        "productId" INTEGER REFERENCES products(id),
        "cartProductsId" INTEGER REFERENCES cart_products(id),
        "quantityOrdered" INTEGER,
        "priceWhenOrdered" DECIMAL
    );

    CREATE TABLE categories(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
    );

    CREATE TABLE product_categories(
        id SERIAL PRIMARY KEY,
        "productId" INTEGER REFERENCES products(id),
        "categoryId" INTEGER REFERENCES categories(id)
    );
    `);
    
    console.log('Finished constructing tables!');
    } catch (error) {
    console.error('Error constructing tables!');

    throw new Error("error while making the tables!")
    }
}

async function createInitialUsers() {
    console.log('Starting to create users...');
    try {

    const usersToCreate = [
        { email: 'abc@here.com', password: 'Password', name: "James", address: '123 here st', city: 'here', state: 'there',  billingInfo: '1212-3232-3434-5454, 123', isAdmin: true},
        { email: 'fakeEmail@email.com', password: 'sandra123', name: "sandra", address: '703 kingsman dr', city: 'here', state: 'there', billingInfo: '9456-4385-4863-4863, 196', isAdmin: false},
        { email: 'glamgal99@email.com', password: 'glamgal123', name: "glamgal", address: '202 walmart avenue', city: 'here', state: 'there', billingInfo: '4586-1369-3166-4523, 652', isAdmin: false}
    ]
    const users = await Promise.all(usersToCreate.map(createUser));

    console.log('Users created:');
    console.log(users);
    console.log('Finished creating users!');
    } catch (error) {
    console.error('Error creating users!');
    throw error;
    }
}

async function createInitialProducts() {
    try {
    console.log('Starting to create products...');

    const productsToCreate = [
        { name: 'first born child...', description: 'for legal purposes, this is fake! serious inquiries only ;)', quantityAvailable: 47, price: 666, photoName: 'FirstBorn'},
        { name: 'Burger Pickle!', description: "deluxe stack of our most premium pickle slivers, freshly peeled off of someone's burger", quantityAvailable: 300, price: 0.75, photoName: 'BurgerPickle'},
        { name: 'Pete (the rock)', description: "very friendly, doesn't require much work. They love doritos. Looking for a forever home!", quantityAvailable: 19, price: 44.95, photoName: 'Pete_the_rock'}
    ]

    const products = await Promise.all(productsToCreate.map(createProducts));

    console.log('products created: ');
    console.log(products);

    console.log('Finished creating products!');
    } catch (error) {
    console.error('Error creating products!');
    throw error;
    }
}


async function createInitialCarts() {
    try {
    console.log('starting to create carts...');

    const cartsToCreate = [
        { userId: 1, age: 4, isActive: true },
        { userId: 2, age: 2, isActive: false },
        { userId: 3, age: 7, isActive: true }
    ]
    const carts = await Promise.all(cartsToCreate.map(createCarts));
    console.log('Carts Created: ', carts)

    console.log('Finished creating carts!')
    } catch (error) {
    console.error('Error creating carts!')
    throw error;
    }
}

async function createInitialCartProducts() {
    try {
    console.log('starting to create cart_products...');
    const [albertsCart, sandrasCart, glamgalsCart] = await getAllCarts();
    const [firstBornChild, burgerPickle, peteTheRock] = await getAllProducts();

    const cartProductsToCreate = [
        {
        cartId: albertsCart.id,
        productId: firstBornChild.id,
        productPrice: firstBornChild.price,
        quantityOfItem: 1 
        },
        {
        cartId: albertsCart.id,
        productId: burgerPickle.id,
        productPrice: burgerPickle.price,
        quantityOfItem: 31
        },
        {
        cartId: sandrasCart.id,
        productId: burgerPickle.id,
        productPrice: burgerPickle.price,
        quantityOfItem: 19
        },
        {
        cartId: sandrasCart.id,
        productId: firstBornChild.id,
        productPrice: firstBornChild.price,
        quantityOfItem: 2
        },
        {
        cartId: glamgalsCart.id,
        productId: firstBornChild.id,
        productPrice: firstBornChild.price,
        quantityOfItem: 1
        },
        {
        cartId: glamgalsCart.id,
        productId: burgerPickle.id,
        productPrice: burgerPickle.price,
        quantityOfItem: 73
        },
        {
        cartId: glamgalsCart.id,
        productId: peteTheRock.id,
        productPrice: peteTheRock.price,
        quantityOfItem: 3
        }
    ]
    const cartProducts = await Promise.all(cartProductsToCreate.map(addProductToCart));


    console.log('cart_products created: ', cartProducts)
    console.log('Finished creating cart_products!')
    } catch (error) {
    console.log("Error while creating cart_products")
    throw error;
    }
}

async function createInitialOrders() {
    try {
        console.log('starting to create orders!')

        const ordersToCreate = [
            { userId: 2, orderDate: '2020-08-15', deliveryDate: '2020-08-23', totalPrice: 1346.25 }
        ]

        const orders = await Promise.all(ordersToCreate.map(createOrder))
        console.log('orders created: ', orders)

        console.log('Finished creating orders')
    } catch(error) {
        console.log("Error creating initial orders!")
        throw error
    }
}

async function createInitialOrderProducts() {
    try {
        console.log("Starting to create order_products!")
        const [firstBorn, burgerPickle, petRock] = await getAllProducts()
        const [albert1, albert2, sandra1, sandra2, glamgal1, glamgal2, glamgal3] = await getAllCartProducts()

        const orderProductsToCreate = [
            { orderId: 1, productId: burgerPickle.id, cartProductsId: sandra1.id, quantityOrdered: sandra1.quantityOfItem, priceWhenOrdered: sandra1.productPrice },
            { orderId: 1, productId: firstBorn, cartProductsId: sandra2.id, quantityOrdered: sandra2.quantityOfItem, priceWhenOrdered: sandra2.productPrice }
        ]

        const orderProducts = await Promise.all(orderProductsToCreate.map(addProductToOrder))

        console.log("Order_products created: ", orderProducts)
        console.log("Finished creating order_products!")
    } catch (error) {
        console.log("Error creating initial order_products!")
        throw error
    }
}

async function createInitialCategories() {
    try {
        console.log("Starting to create initial categories!")

        const categoriesToCreate = [
            { name: 'Fantasy?' },
            { name: 'Everything Pickles' },
            { name: 'Pet Rocks' }
        ]

        const categories = await Promise.all(categoriesToCreate.map(createCategory))
        console.log("Categories created: ", categories)

        console.log("Finished creating initial categories!")
    } catch (error) {
        console.log("Error while creating intial categories!")
        throw error
    }
}

async function createInitialProductCategories() {
    try {
        console.log("Starting to create initial product_categories")
        const [firstBorn, burgerPickle, petRock] = await getAllProducts()
        const [fantasy, pickles, rocks] = await getAllCategories()

        const productCategoriesToCreate = [
            { productId: firstBorn.id, categoryId: fantasy.id },
            { productId: burgerPickle.id, categoryId: pickles.id },
            { productId: petRock.id, categoryId: rocks.id}
        ]

        const productCategories = await Promise.all(productCategoriesToCreate.map(addProductToCategory))
        console.log("Added products to categories: ", productCategories)

        console.log("Finished creating product_categories!")
    } catch (error) {
        console.log("Error while creating initial product_categories")
        throw error
    }
}

async function rebuildDB() {
    try {
        client.connect();
        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialProducts();
        await createInitialCarts();
        await createInitialCartProducts();
        await createInitialOrders();
        // await createInitialOrderProducts();
        await createInitialCategories();
        // await createInitialProductCategories();
        console.log("RebuildDB function was successfull!")
    } catch (error) {
        console.log('Error during rebuildDB');
        throw error;
    }
}

rebuildDB()
  .catch(console.error)
  .finally(() => client.end());
