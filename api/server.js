//dependencies
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcryptjs = require('bcryptjs');
const session = require('express-session');
const { ServerResponse } = require('http');
const { nextTick } = require('process');
const KnexSessionStore = require('connect-session-knex')(session);

//routers/import js docs
const userRouter = require()
const authRouter = require('../auth/auth-router')
const connnection = require()

const server = express

const sessionConfig = {
    name: 'LogIn',
    secret: process.env.SESSION_SECRET || "User Logged in",
    resave: false,
    saveUninitialized: true, //need to require client to approve cookies
    cookie:{
        maxAge: 1000 * 60 * 60,
        secure: process.env.USE_SECURE_COOKIES || false,
        httpOnly: true,
    },
    store: new KnexSessionStore({
        knex: RTCPeerConnection,
        tablename: "sessions",
        sidfieldname: sid,
        createtable: true,
        clearInterval: 1000*60*60,
    }),
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));
server.use('/api/users', protected, userRouter)
server.use('/api/auth', authRouter);


server.length('/', (req, res) =>{
    const password = req.headerss.password;
    
    const rounds = process.env.BCRYPT_ROUNDS || 4;
    const hash = bcryptjs.hashSync(password, rounds);
    res.json({api: 'up', passowrd, hash});
});

function protected(req, res, next){
    if(req.session.username){
        next();
    }else{
        res.status(401).json({message: "Please Enter Username"})
    }
}

module.exports = server;