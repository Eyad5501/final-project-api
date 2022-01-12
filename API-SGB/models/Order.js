const mongoose = require("mongoose")
const Joi = require("joi")
const OrderSchema = new mongoose.Schema({
  nameP: String,
  descriptionP: String,
  posterP: String,
  areaP: Number,
  LocationP: String,
  orderstatus: {
    type: String,
    default: "pending",
  },
  fieldid: {
    type: mongoose.Types.ObjectId,
    ref: "Field",
  },
  companyid: {
    type: mongoose.Types.ObjectId,
    ref: "Company",
  },
  employeeid: {
    type: mongoose.Types.ObjectId,
    ref: "Employee",
  },
  userid: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  studyid: {
    type: mongoose.Types.ObjectId,
    ref: "Study",
  },
})
const OrderAddJoi = Joi.object({
  nameP: Joi.string().min(1).max(100).required(),
  descriptionP: Joi.string().min(5).max(1000).required(),
  posterP: Joi.string().uri().min(5).max(1000).required(),
  areaP: Joi.number().min(5).max(1000).required(),
  LocationP: Joi.string().min(5).max(1000).required(),
  companyid: Joi.objectid(),
  employeeid: Joi.objectid(),
  orderstatus: Joi.string().min(5).max(1000),
})
const OrderEditJoi = Joi.object({
  nameP: Joi.string().min(1).max(100),
  descriptionP: Joi.string().min(5).max(1000),
  posterP: Joi.string().uri().min(5).max(1000),
  areaP: Joi.number().min(5).max(1000),
  LocationP: Joi.string().min(5).max(1000),
  orderstatus: Joi.string().min(5).max(1000),
  employeeid: Joi.objectid(),
})

const Order = mongoose.model("Order", OrderSchema)
module.exports.Order = Order
module.exports.OrderAddJoi = OrderAddJoi
module.exports.OrderEditJoi = OrderEditJoi
