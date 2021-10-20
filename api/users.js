const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const usersRouter = express.Router();

const {
	createUser,
    getUserById,
    getUserByEmail,
	getAllUsers,
    deleteUser,
    updateUserInfo,
    updatePassword
} = require('../db/users');
const { user } = require('pg/lib/defaults');

usersRouter.use((req, res, next) => {
    console.log("A request is being made to /users");
    next(); 
});

usersRouter.get('/', async (req, res, next) => {
    try {
        const users = await getAllUsers()
        res.send(users)

    } catch (error) {
        throw error
    }
})

usersRouter.post('/register', async (req, res, next) => {
	const {email, password} = req.body;
	try {
		if(!email.includes('@') || !email.includes('.')) {
			return res.status(400).send({
				message: "Please enter a valid email address."
			})
		}
		if(password.length < 8) {
			return res.status(400).send({
				message: "Password must be at least eight characters long."
			});
		};

		const existingEmail = await getUserByEmail(email);
		if(typeof(existingUser) == 'object') {
			return res.status(400).send({
				message: "This email address is already associated with another account."
			})
		};
		const user = await createUser(req.body);

		const token = jwt.sign(
			{
				id: user.id,
				name: user.name,
			}, JWT_SECRET, {
				expiresIn: '1w'
			}
		);
		const finalReturn = {
			message: "Thank you for registering.",
			token: token,
			user: token.name
		};
		res.send(JSON.stringify(finalReturn));
	} catch(error) {
		next(error);
	} 
});

usersRouter.post('/login', async (req, res, next) => {
	const {email, password} = req.body;

	if(!email || !password) {
		next({
			name: "Missing Credentials",
			message: "You need both an email address and password to login."
		});
	};

	try {
		const user = await getUserByEmail(email);
		const isCorrectPassword = await bcrypt.compare( password, user.password);

		if(user && isCorrectPassword) {
			const token = jwt.sign({ 
				id: user.id,
				name: user.name
			}, JWT_SECRET, {
				expiresIn: '1w'
			});
			res.send({
				status: 204,
				message: "You have successfully logged in.",
				name: user.name,
				token: token
				
			})
		} else {
			res.send({
				message: "Email or password is incorrect."
			})
		};
	} catch(error) {
		next(error);
	}
});

usersRouter.get('/profile', async (req, res, next) => {
	try {
		const token = req.headers.authorization.slice(7, req.headers.authorization.length);
		const decoded = jwt.verify(token, JWT_SECRET);
		const name = {name: decoded.name};
		res.send(JSON.stringify(name));
	} catch(error) {
		next(error);
	}
});

usersRouter.patch('/:userId/info', async (req, res, next) => {
	try {
		const {userId} = req.params;
		const {name, address, city, state} = req.body;
		const fields = {};
		if(name){
			fields.name = name;
		}
		if(address){
			fields.address = address;
		}
		if(city){
			fields.city = city;
		}
		if(state){
			fields.state = state;
		}
		const updated = updateUserInfo(userId, fields);
		res.send({
			status: 204,
			message: "You have successfully edited your info."
		});
	} catch(error) {
		next(error);
	}
});

usersRouter.patch('/:userId/billing', async (req, res, next) => {
	try {
		const {userId} = req.params;
		const {card, cvv} = req.body;
		const fields = {billingInfo: card + ', ' + cvv};
		const updated = updateUserInfo(userId, fields);
		res.send({
			status: 204,
			message: "You have successfully edited your billing info."
		});
	} catch(error) {
		next(error);
	}
})

usersRouter.patch('/:userId/password', async (req, res, next) => {
	try {
		const {userId} = req.params;
		const {password, newPassword} = req.body;
		console.log('current and new passwords from api: ', password, newPassword);

		const user = await getUserById(userId);
		const isCorrectPassword = await bcrypt.compare( password, user.password);

		console.log('isCorrectPassword: ', isCorrectPassword);

		if(isCorrectPassword) {
			const updated = updatePassword(userId, newPassword)
			res.send({
				status: 204,
				message: "You have successfully updated your password."
			})
		} else {
			res.send({
				status: 401,
				message: "Incorrect current password."
			})
		}
	} catch(error) {
		next(error);
	}
});

usersRouter.delete('/:userId', async (req, res, next) => {
	const {userId} = req.params;
	try{
		const deletedUser = await deleteUser(userId);
		res.send(deletedUser);
	} catch(error) {
		next(error);
	};

});

module.exports = {usersRouter};