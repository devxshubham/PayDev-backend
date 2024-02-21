const {JWT_SECRET} = require('./config')

const jwt = require('jsonwebtoken')

module.exports.authMiddleware = (req, res, next) =>{
    const authHeader = req.headers.authorization
    if( !authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(403).json({msg : "invalid"})
    }
    try{
            const token = authHeader.split(" ")[1]
            const decoded = jwt.verify(token, JWT_SECRET)

            req.userId = decoded.userId
            next();
        }
        catch(error){
            res.status(403).send({
                err : error
            })
        }
    }