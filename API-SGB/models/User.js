const mongoose = require("mongoose")
const Joi = require("joi")
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phone:String,
  email: String,
  emailVerified:{
    type:Boolean,
    default:false,
  },

  password: String,
  avatar: String,
 
  role:{
      type:String,
      enum:["Admin","User"],
      default:"User"
      
  },
  orders:[{
    type: mongoose.Types.ObjectId,
    ref:"Order",
  }]
})
const signUpJoi = Joi.object({
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  phone:Joi.string().min(10),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  avatar: Joi.string().uri().required(),
})
const loginJoi = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
})
const profileJoi = Joi.object({
    firstName: Joi.string().min(2).max(100).required(),
    lastName: Joi.string().min(2).max(100).required(),
    phone:Joi.string().min(10).required(),
    password: Joi.string().min(6).max(100).required(),
    avatar: Joi.string().uri().min(6).max(100).required(),
})

const User = mongoose.model("User", userSchema)
module.exports.User = User
module.exports.signUpJoi = signUpJoi
module.exports.loginJoi = loginJoi
module.exports.profileJoi = profileJoi
