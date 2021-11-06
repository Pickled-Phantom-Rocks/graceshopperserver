const client = require('./client'); 
const {
    createUser,
    createProducts,
    createCarts,
    createCategory,
    createOrder,
    getAllCarts,
    getAllProducts,
    addProductToCart,
    getAllCategories,
    addProductToCategory,
    createOrder_Product,
    getAllCartProducts
} = require('./')

async function dropTables() {
    try {
    console.log('Dropping All Tables...');
    await client.query(`

    DROP TABLE IF EXISTS order_products;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS cart_products;
    DROP TABLE IF EXISTS carts;
    DROP TABLE IF EXISTS category_products;
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
        "totalPrice" DECIMAL,
        "orderStatus" VARCHAR(255)
    );

    CREATE TABLE order_products(
        id SERIAL PRIMARY KEY,
        "orderId" INTEGER REFERENCES orders(id),
        "productId" INTEGER,
        "quantityOrdered" INTEGER,
        "priceWhenOrdered" DECIMAL,
        name VARCHAR(255) UNIQUE NOT NULL,
        description VARCHAR (255),
        "photoName" VARCHAR(255)
    );

    CREATE TABLE categories(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
    );

    CREATE TABLE category_products(
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
        { name: 'Alamogordo', description: 'Just wants to be loved! CAUTION- SPICY', quantityAvailable: 50, price: 10, photoName: '2'},
        { name: 'Alluring Gherkins of Heliotrope Hue', description: "Their countenance is elegant and winsome as a summer's moon, and their prodigious girth remains unchallenged by any! (Extra shipping costs may apply due to heavy item)", quantityAvailable: 50, price: 10, photoName: '3'},
        { name: 'Beta', description: 'Always a bit underwh-- hey! These are beets!', quantityAvailable: 50, price: 5, photoName: '4'},
        { name: 'Bread', description: "Comfortable and wholesome", quantityAvailable: 50, price: 5, photoName: '5'},
        { name: 'Butter', description: "Definitely ready for line-dancing", quantityAvailable: 50, price: 5, photoName: '6'},
        { name: 'Cabochon Party Mix', description: 'All the anxiety of the Cornichon, now in a fun variety pack! Great for kids!', quantityAvailable: 50, price: 5, photoName: '7'},
        { name: 'Candied', description: 'Overly sweet and obsessively interested in your thoughts.', quantityAvailable: 50, price: 5, photoName: '8'},
        { name: 'Chatoyant', description: 'Always spoiling for a fight; often compared to Rocky Balboa', quantityAvailable: 50, price: 5, photoName: '9'},
        { name: 'Cinnamon', description: 'Obsessed with various winter holidays', quantityAvailable: 50, price: 5, photoName: '10'},
        { name: 'Cornichon', description: "Doesn't want you to know they're just a gherkin with anxiety", quantityAvailable: 50, price: 5, photoName: '11'},
        { name: 'Dill', description: 'A sour boy with no aspirations', quantityAvailable: 50, price: 5, photoName: '12'},
        { name: 'Genuine Dill', description: "The real VIP who will tell you all about how Dill ain't really true rock royalty", quantityAvailable: 50, price: 5, photoName: '13'},
        { name: 'German', description: 'Not nearly as salty as people think', quantityAvailable: 50, price: 5, photoName: '14'},
        { name: 'Gherkin', description: 'Small but mighty', quantityAvailable: 50, price: 5, photoName: '11'},
        { name: 'A rock', description: "It's just a rock, what did you expect?", quantityAvailable: 1000, price: 1, photoName: '1'},
        { name: 'Gherkin Geode', description: 'GET READY FOR CHALLENGE MOSE', quantityAvailable: 50, price: 5, photoName: '16'},
        { name: 'Half-Sour', description: 'why try when half the effort will suffice', quantityAvailable: 50, price: 5, photoName: '17'},
        { name: 'Hungarian', description: 'A mixed bag of random', quantityAvailable: 50, price: 5, photoName: '18'},
        { name: 'Jade Wonder', description: "So breathtakingly beautiful they're hard to eat", quantityAvailable: 50, price: 5, photoName: '19'},
        { name: 'Kimchi Striation', description: 'Eldritch Concoction', quantityAvailable: 50, price: 5, photoName: '20'},
        { name: 'Kool-Aid', description: "We're not Mad, just Disappointed.", quantityAvailable: 50, price: 5, photoName: '22'},
        { name: 'Kosher Dill', description: 'An exectutive rock that has planned twenty years into a ten year plan', quantityAvailable: 50, price: 5, photoName: '15'},
        { name: 'Lime', description: 'Often feels out of place', quantityAvailable: 50, price: 5, photoName: '21'},
        { name: 'Old Greg', description: 'This One Makes you Fear for your Family', quantityAvailable: 50, price: 5, photoName: '23'},
        { name: 'Overnight Dill', description: "Doesn't want to talk about it.", quantityAvailable: 50, price: 5, photoName: '24'},
        { name: 'Polish', description: 'They are pretty chuffed just to be included', quantityAvailable: 50, price: 5, photoName: '25'},
        { name: 'Sweet', description: 'Always ready to help with your homework or listen to your worries', quantityAvailable: 50, price: 5, photoName: '26'},
        { name: 'The Ghost of Pickles Past', description: "You know why he's come for you.", quantityAvailable: 50, price: 5, photoName: '27'}
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
            { userId: 1, orderDate: '2020-08-15', deliveryDate: '2020-08-23', totalPrice: 1346.25, orderStatus: 'Completed' },
            { userId: 2, orderDate: '2021-09-15', deliveryDate: '2021-9-23', totalPrice: 136.25, orderStatus: 'Processing' },
            { userId: 3, orderDate: '2021-10-15', deliveryDate: '2021-10-23', totalPrice: 134.25, orderStatus: 'Processing' },
            { userId: 2, orderDate: '2021-10-30', totalPrice: 100, orderStatus: 'Created'},
            { userId: 3, orderDate: '2021-10-30', totalPrice: 100, orderStatus: 'Processing'},
            { userId: 1, orderDate: '2021-10-30', totalPrice: 100, orderStatus: 'Cancelled'}
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
            { orderId: 1, 
                productId: burgerPickle.id, 
                quantityOrdered: sandra1.quantityOfItem, 
                priceWhenOrdered: sandra1.productPrice, 
                name: burgerPickle.name, 
                description: burgerPickle.description, 
                price: burgerPickle.price, 
                photoName: burgerPickle.photoName },
            { orderId: 2, 
                productId: petRock.id, 
                quantityOrdered: albert1.quantityOfItem, 
                priceWhenOrdered: albert1.productPrice, 
                name: petRock.name, 
                description: petRock.description, 
                price: petRock.price, 
                photoName: petRock.photoName },
            { orderId: 1, 
                productId: firstBorn.id, 
                quantityOrdered: sandra2.quantityOfItem, 
                priceWhenOrdered: sandra2.productPrice,
                name: firstBorn.name,
                description: firstBorn.description,
                price: firstBorn.price,
                photoName: firstBorn.photoName }
        ]

        const orderProducts = await Promise.all(orderProductsToCreate.map(createOrder_Product))

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
            'Anxious',
            'Boring',
            'Creepy',
            'Gentle',
            'Inspiring',
            'Tired',
            'Pendantic',
            'Rambuncious',
            'Silly',
            'Sour',
            'Spicy',
            'Sweet'
        ]

        const categories = await Promise.all(categoriesToCreate.map(createCategory))
        console.log("Categories created: ", categories)

        console.log("Finished creating initial categories!")
    } catch (error) {
        console.log("Error while creating intial categories!")
        throw error
    }
}

async function createInitialCategoryProducts() {
    try {
        console.log("Starting to create initial product_categories")
        const [Rock, Almogordo, Alluring, Beta, Bread, Butter, Cabocon, Candied, Chatoyant, Cinnamon, Cornichon, Dill, Genuine, German, Gherkin, Geode, Half, Hungarian, Jade, Kimchi, Kool, Kosher, Lime, Greg, Overnight, Polish, Sweet, Ghost] = await getAllProducts()
        const [Anxious, Boring, Creepy, Gentle, Inspiring, Tired, Pendantic, Rambuncious, Silly, Sour, Spicy, sweet] = await getAllCategories()

        const productCategoriesToCreate = [
            { productId: Rock.id, categoryId: Silly.id },
            { productId: Almogordo.id, categoryId: Spicy.id },
            { productId: Alluring.id, categoryId: Silly.id },
            { productId: Beta.id, categoryId: Silly.id},
            { productId: Bread.id, categoryId: Sour.id},
            { productId: Butter.id, categoryId: Gentle.id},
            { productId: Cabocon.id, categoryId: Anxious.id},
            { productId: Candied.id, categoryId: Anxious.id},
            { productId: Chatoyant.id, categoryId: Rambuncious.id},
            { productId: Cinnamon.id, categoryId: sweet.id},
            { productId: Cornichon.id, categoryId: Anxious.id},
            { productId: Dill.id, categoryId: Sour.id},
            { productId: Genuine.id, categoryId: Sour.id},
            { productId: German.id, categoryId: Sour.id},
            { productId: Gherkin.id, categoryId: Sour.id},
            { productId: Geode.id, categoryId: Silly.id},
            { productId: Half.id, categoryId: Sour.id},
            { productId: Hungarian.id, categoryId: Sour.id},
            { productId: Jade.id, categoryId: Inspiring.id},
            { productId: Kimchi.id, categoryId: Creepy.id},
            { productId: Kool.id, categoryId: Silly.id},
            { productId: Kosher.id, categoryId: Pendantic.id},
            { productId: Lime.id, categoryId: Silly.id},
            { productId: Greg.id, categoryId: Creepy.id},
            { productId: Overnight.id, categoryId: Tired.id},
            { productId: Polish.id, categoryId: Boring.id},
            { productId: Sweet.id, categoryId: sweet.id},
            { productId: Ghost.id, categoryId: Creepy.id},
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
        await createInitialOrderProducts();
        await createInitialCategories();
        await createInitialCategoryProducts();
        console.log("RebuildDB function was successfull!")
    } catch (error) {
        console.log('Error during rebuildDB');
        throw error;
    }
}

rebuildDB()
  .catch(console.error)
  .finally(() => client.end());
