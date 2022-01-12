const mongoose = require("mongoose")
const Joi = require("joi")
const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  rating: Number,
})
const companySchema = new mongoose.Schema({
  nameCompany: String,
  password: String,
  email: String,
  photo: String,
  ratings: [ratingSchema],
  ratingAverage: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
    },
  ],
  employees: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Employee",
    },
  ],
  fields: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Field",
    },
  ],
  verified: {
    type: Boolean,
    default: false,
  },
  orders: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Order",
    },
  ],
  role: {
    type: String,
    default: "Company",
  },
})

const companyAddJoi = Joi.object({
  nameCompany: Joi.string().min(1).max(200).required(),
  photo: Joi.string().uri().min(5).max(1000).required(),
  email: Joi.string().email(),
  password: Joi.string().min(6).max(100).required(),
  employees: Joi.array().items(Joi.objectid()).min(1),
  fields: Joi.array().items(Joi.objectid()).min(1),
})
const companyEditJoi = Joi.object({
  nameCompany: Joi.string().min(1).max(200),
  photo: Joi.string().uri().min(5).max(1000),
  employees: Joi.array().items(Joi.objectid()).min(1),
  fields: Joi.array().items(Joi.objectid()).min(1),
})
const ratingJoi = Joi.object({
  rating: Joi.number().min(0).max(5).required(),
})
const companysignUpJoi = Joi.object({
  nameCompany: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  photo: Joi.string().uri().required(),
})
const companyloginJoi = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
})
const companyprofileJoi = Joi.object({
  nameCompany: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  photo: Joi.string().uri().required(),
})
const companyAddCompanyPJoi = Joi.object({
  nameCompany: Joi.string().min(1).max(200).required(),
  photo: Joi.string().uri().min(5).max(1000).required(),
  employees: Joi.array().items(Joi.objectid()).min(1),
  fields: Joi.array().items(Joi.objectid()).min(1)
})

const Company = mongoose.model("Company", companySchema)
module.exports.Company = Company
module.exports.companyAddJoi = companyAddJoi
module.exports.companyEditJoi = companyEditJoi
module.exports.ratingJoi = ratingJoi
module.exports.companyloginJoi = companyloginJoi
module.exports.companysignUpJoi = companysignUpJoi
module.exports.companyprofileJoi = companyprofileJoi
module.exports.companyAddCompanyPJoi = companyAddCompanyPJoi
