const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    const token = req.headers.authorization;
    const secret = process.env.JWT_SECRET || "is it secret";

    if(token){
        jwt.verify(token,secret, (err, decodedToken) =>{
            err ?
            res.status(401).json({message: 'not authorized'})
            : req.jwt = decodedToken
            next()
        })
    }else{
        res.status(401).JSON({message: 'No Token'})
    }

}