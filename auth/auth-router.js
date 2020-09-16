const router = require('express').Router();
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken');
const Users = require('../users/users-models')
const {isValid} = require('../users/users-service.js');

router.post('/register', (req, res) =>{
    // const userInfo = req.body;
    // const isValid = validateUser(userInfo);
    const credentials = req.body;

    if(isValid(credentials)){
        const rounds = process.env.BCRYPT_ROUNDS || 8;

        const hash = bcryptjs.hashSync(credentials.password, rounds);
        credentials.password = hash;

        Users.add(credentials)
            .then(user =>{
                const token = makeJwt(user);
                res.status(201).json({data: user, token});
            })
            .catch(error =>{
                res.status(500).json({message: error.message});
            });
    }else{
        res.status(400).json({
            message: 'Invalid information, please verify and try again',
        });
    }
})

router.post('/login', (req, res) => {
    const creds = req.body;
    const isValid = validateCredentials(creds);

    if(isValid){
        Users.findBy({username: creds.username})
            .then(([user]) =>{
                if(user && bcryptjs.compareSync(creds.password, user.password)){
                    req.session.username = user.username;
                    req.session.role = user.role;
                    res.status(200).json({
                        message: `welcome ${creds.username}`,
                    });
                }else{
                    res.status(401).json({message: "(Incorrect Credentials"})
                }
            })
    }else{
        res.status(400).json({
            message: "Invalid information, please verify and try again",
        })
    }
})

router.get('/logout', (req, res) =>{
    if(req.session){
        req.session.destroy(err =>{
            if(err){
                res.status(500).json({
                    message: 'Unable to destroy session'
                })
            }else{
                res.status(204).end();
            }
        });
    }else{
        res.status(204).end()
    }
})

function makeJwt({id, username, role}){
    const payload = {
        username,
        role,
        subject: id,
    }
    const config = {
        jwtSecret: process.env.JWT_SECRET || "is it secret"
    };
    const options = {
        expiresIn: '8 hours',
    };
    return jwt.sign(payload, config.jwtSecret, options)
};


// function validateUser(user){
//     return user.username && user.password && user.role ? true : false;
// }

// function validateCredentials(creds){
//     return creds.username && creds.password ? true : false;
// }

module.exports = router;