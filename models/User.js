const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken') 

const userSchema = new mongoose.Schema({
    "name":{
        type:String,
        required:[true,"Please provide name"],
        maxLength:30,
        minLength:3
    },
    "email":{
        type:String,
        required: [true, 'Please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
          ],
        unique: true,
    },
    "password":{
        type:String,
        required: [true, 'Please provide password'],
        minLength:6
    }
})

/*This is a middleware to hash the password. We can add here prior to saving.
The code looks cleaner here. Also, we don't need to create a temp object to save the new password.
We can instead use the 'this' keywordd
*/
userSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
})

//This is a instance method - createJWTToken - cleaner code
userSchema.methods.createJWTToken = function(){
    return jwt.sign({userID: this._id,username:this.name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
} 

userSchema.methods.comparePassword = async function(pass){
   const isMatch = await bcrypt.compare(pass,this.password)
   return isMatch
}

module.exports = mongoose.model('User', userSchema)