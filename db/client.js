const { Client } = require('pg'); 
//const client = new Client(process.env.DATABASE_URL || 'postgresql://pppadmin:123456@localhost:5432/graceshopper-dev');

const client = new Client({
	connectionString: process.env.DATABASE_URL || 'postgres://localhost:5432/juicebox-dev',
	ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  });


module.exports =  client 