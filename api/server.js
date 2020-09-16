//dependencies
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

//routers/import js docs
const userRouter = require('../users/users-router.js')
const authRouter = require('../auth/auth-router.js')

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors({
    origin: '*',
    credentials: true,
}));


server.use('/api/users', userRouter)
server.use('/api/auth', authRouter);


server.get('/', (req, res) =>{
    res.json({api: 'up'});
});

module.exports = server;