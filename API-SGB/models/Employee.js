const mongoose = require("mongoose")
const Joi = require("joi")

const employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  photo: String,
  phone: String,
  email: String,
  password: String,
  companyid: {
    type: mongoose.Types.ObjectId,
    ref: "Company",
  },
  studise: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Study",
    },
  ],
  fields: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Field",
    },
  ],
  orders: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Order",
    },
  ],
  role: {
    type: String,
    default: "Employee",
  },
})
const employeesignUpJoi = Joi.object({
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  phone: Joi.string().min(10),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  photo: Joi.string().uri().required(),
  fields: Joi.array().items(Joi.objectid()).min(1),
})
const employeeloginJoi = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
})
const employeeAddJoi = Joi.object({
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  photo: Joi.string().min(1).max(1000).required(),
  phone: Joi.string().min(10),
  password: Joi.string().min(6).max(100).required(),

  email: Joi.string().email(),
  studise: Joi.array().items(Joi.objectid()).min(1),
  fields: Joi.array().items(Joi.objectid()).min(1),
  companyid: Joi.objectid(),
})
const employeeEditJoi = Joi.object({
  firstName: Joi.string().min(2).max(100),
  lastName: Joi.string().min(2).max(100),
  photo: Joi.string().min(1).max(1000),
  phone: Joi.string().min(10),
  email: Joi.string().email(),
  studise: Joi.string().min(1).max(200),
  fields: Joi.array().items(Joi.objectid()).min(1),
})
const employeeprofileJoi = Joi.object({
  firstName: Joi.string().min(2).max(100),
  lastName: Joi.string().min(2).max(100),
  phone: Joi.string().min(10),
  email: Joi.string().email(),
  password: Joi.string().min(6).max(100),
  photo: Joi.string().uri().min(6).max(1000),
})

const Employee = mongoose.model("Employee", employeeSchema)
module.exports.Employee = Employee
module.exports.employeeAddJoi = employeeAddJoi
module.exports.employeeEditJoi = employeeEditJoi
module.exports.employeesignUpJoi = employeesignUpJoi
module.exports.employeeloginJoi = employeeloginJoi
module.exports.employeeprofileJoi = employeeprofileJoi
