const mongoose = require("mongoose")
const Joi = require("joi")
const studySchema = new mongoose.Schema({
   study:String,
     uesrid:{
        type: mongoose.Types.ObjectId,
        ref:"User",
     },
     companyid:{
        type: mongoose.Types.ObjectId,
        ref:"Company",
     },
     orderid:{
        type: mongoose.Types.ObjectId,
        ref:"Order",
     },
   //   employeeid:{
   //      type: mongoose.Types.ObjectId,
   //      ref:"Employee",
   //   }
       
  })
  const studyJoi=Joi.object({
    study:Joi.string().uri().min(3).max(1000).required(),
    uesrid: Joi.objectid(),
    companyid: Joi.objectid(),
    orderid: Joi.objectid(),
   //  employeeid: Joi.objectid(),


})
 const Study=mongoose.model("Study",studySchema)
 module.exports.Study = Study
 module.exports.studyJoi=studyJoi