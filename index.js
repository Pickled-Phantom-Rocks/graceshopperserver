require('dotenv').config();
const { PORT = 3000 } = process.env

const express = require('express');
const server = express();

const client = require('./db/client');

const morgan = require('morgan');
server.use(morgan('dev'));

const cors = require('cors');
server.use(cors());

const bodyParser = require('body-parser');
server.use(bodyParser.json());

server.use('/api', require("./api"));

server.listen(PORT, () => {
    console.log(`client is connected on port ${PORT}`)
    client.connect();
});