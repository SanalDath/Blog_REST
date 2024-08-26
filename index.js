const dotenv = require('dotenv');
dotenv.config();

const http = require('http');
const app = require('./app');
const { port } = require('./config/keys');


const server = http.createServer(app);

server.listen(port, () => console.log(`Server connected successfully to ${port}`));
