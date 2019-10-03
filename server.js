const express = require('express');
const helmet = require('helmet');
const UserRouter = require('./users/userRouter.js');
const server = express();



server.get('/', (req, res) => {
    res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
    next();
};

server.use(logger); // made this one below
server.use(helmet()); // this is third party
server.use(express.json()); // built in and using from express

//below is where any validation would go for users
server.use('/api/user', UserRouter);
// server.user('/api/user/:id', validateUserId);

server.use(errorHandler);

function errorHandler(error, req, res, next) {
    console.log(error);
    res.status(401).json({ Error: 'may not enter' });
}

module.exports = server;