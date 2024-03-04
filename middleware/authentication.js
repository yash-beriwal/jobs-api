const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors/index')

const authenticationMiddleWare = async(req,res,next)=>{
    const authorizationHeader = req.headers.authorization
    if(!authorizationHeader || !authorizationHeader.startsWith('Bearer'))
        throw new UnauthenticatedError('Authorization Invalid')
    const token = authorizationHeader.split(' ')[1]
    try{
        const payload = jwt.verify(token,process.env.JWT_SECRET)
        //We are a req.user object
        req.user = {userID:payload.userID, username:payload.username}
        // console.log(payload)
        next()
    }catch(err){
        throw new UnauthenticatedError('Authorization Invalid')
    }
}

module.exports = authenticationMiddleWare