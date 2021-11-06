const { Client } = require('pg'); 
const client = new Client(process.env.DATABASE_URL || 'postgresql://pppadmin:123456@localhost:5432/graceshopper-dev');

module.exports =  client 