const { PORT, CONNECTION_URL, JWT_SECRET } = process.env;

// console.log('PORT:', PORT);
// console.log('CONNECTION_URL:', CONNECTION_URL);

module.exports = { port: PORT, connectionUrl: CONNECTION_URL, jwtSecret: JWT_SECRET };
