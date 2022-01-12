const mongoose = require("mongoose")
const Joi = require("joi")

const fieldSchema = new mongoose.Schema({
  typeField: String,
  photo:String,

//   employeeid:{
//     type: mongoose.Types.ObjectId,
//     ref: "Employeer",
//  }
})
const fieldJoi = Joi.object({
    typeField: Joi.string().min(1).max(1000).required(),
    photo: Joi.string().uri().required(),
})

const Field = mongoose.model("Field",fieldSchema)
module.exports.Field = Field
module.exports.fieldJoi = fieldJoi
