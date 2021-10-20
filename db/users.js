const client = require('./client');
const bcrypt = require('bcrypt');

async function createUser({
    email,
    password,
    name,
    address,
    city,
    state,
    billingInfo,
    isAdmin
}) {
    try {
        const SALT_COUNT = 10;
        const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

        const { rows: [user] } = await client.query(`
            INSERT INTO users(email, password, name, address, city, state, "billingInfo", "isAdmin") 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
            ON CONFLICT (email) DO NOTHING
            RETURNING id, email, password, name, address, city, state, "billingInfo";
      `, [email, hashedPassword, name, address, city, state, billingInfo, isAdmin]);

        return user;
    } catch (error) {
        throw error;
    }
}

async function getUser({email, password,}) {
    if(!email || !password){
        return;
    }
    try {
        const user = await getUserByEmail(email);
        const hashedPassword = user.password;
        const passwordsMatch = await bcrypt.compare(password, hashedPassword);

        if(passwordsMatch){
            delete user.password
            return user
        }else{
            return;
        }
    } catch (error) {
        throw error;
    }
}

async function getUserById(userId) {
    try {
        const { rows: [user] } = await client.query(`
            SELECT *
            FROM users
            WHERE id = ${userId};
      `);

        if (!user) {
            return null
        }

        return user;
    } catch (error) {
        throw error;
    }
};

async function getUserByEmail(email) {
    try {
        const { rows: [user] } = await client.query(`
            SELECT *
            FROM users
            WHERE email=$1;
        `, [email]);

        return user;
    } catch (error) {
        throw error;
    }
};

async function getAllUsers() {
    try {
        const {rows : users} = await client.query(`
            SELECT *
            FROM users;
        `)
        return users;
    } catch (error) {
        throw error;
    }
};

async function deleteUser(userId) {
    try {
        const {rows: [user]} = await client.query(`
            DELETE FROM users
            WHERE id=$1;
        `, [userId]);
        return user;
    } catch (error) {
        throw error;
    }
}

async function updateUserInfo (id, fields) {

    const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
  
    if (setString.length === 0) {
      return;
    }
    try {
      const { rows: [ user ]} = await client.query(`
        UPDATE users
        SET ${ setString }
        WHERE id=${id}
        RETURNING *;
      `, Object.values(fields));
      return user;
  
    } catch (error) {
      throw error;
    }
  };

  async function updatePassword (id, password) {
    try {
        const SALT_COUNT = 10;
        const newHashedPassword = await bcrypt.hash(password, SALT_COUNT);

        const { rows: [ user ]} = await client.query(`
            UPDATE users
            SET password = $1
            WHERE id=${id}
            RETURNING *;
            `, [newHashedPassword]);
        return user;

    } catch (error) {
      throw error;
    }
  };

module.exports = {
    createUser,
    getUser,
    getUserById,
    getUserByEmail,
    getAllUsers,
    deleteUser,
    updateUserInfo,
    updatePassword
}