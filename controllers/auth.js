const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {CustomAPIError,UnauthenticatedError,NotFoundError,BadRequestError} = require('../errors/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken') 

const register = async(req,res)=>{
    const {name,password,email} = req.body

    /*We will now be hashing the password and store all the parameters in a temp object
    We can add the hashed password logic here or add it as a middleware in models/User.js file
    */
    // const salt = await bcrypt.genSalt(10)
    // const hashedPassword = await bcrypt.hash(password,salt)
    // const tempUser = {name,password:hashedPassword,email}
    // const user = await User.create({...tempUser})

    const user = await User.create({...req.body})

    //We can either create the token here directly or create a instance method like 'createJWTToken' which is present in models/User.js
    // const token = jwt.sign({userID: user._id,username:user.name},process.env.JWT_SECRET,{expiresIn:'30d'})
    const token = user.createJWTToken()
    // console.log(token)
    res.status(StatusCodes.CREATED).json({user:{name: user.name},token})
}

const login = async(req,res)=>{
    const{email,password} = req.body
    // console.log(req.headers)
    //If email or password not provided - throw Bad request error
    if(!email || !password)
        throw new BadRequestError('Please provide email and password')

    const user = await User.findOne({email})
    if(!user)
        throw new UnauthenticatedError('Invalid credentials - email')

    //We have created instance method 'comparePassword' in models/User.js
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect)
        throw new UnauthenticatedError('Invalid credentials - password')

    const token = user.createJWTToken()
    res.status(StatusCodes.OK).json({user:{name: user.name},token})
}

module.exports = {register,login}