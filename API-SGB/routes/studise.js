const express = require("express")
const router = express.Router()
const checkTokene = require("../middleware/checkTokene.js")
const validateBody = require("../middleware/validateBody")
const { Employee } = require("../models/Employee.js")
const { Order } = require("../models/Order.js")
const{Study,studyJoi}=require("../models/Study")

router.get("/", async (req, res) => {
    const studies = await Study.find().populate("companyid").populate("uesrid").populate("orderid")
    res.json(studies)
  })
router.post("/", checkTokene, validateBody(studyJoi), async (req, res) => {
    try {
      const {orderid,study } = req.body
      const order = await Order.findById(orderid)
 
      if (!order) return res.status(404).send("order not found")
      const studies = new Study({
        uesrid: order.userid,
        companyid: order.companyid,
        orderid,
        study,
        employeeid:req.employeeId,
      })
      await studies.save()
      await Employee.findByIdAndUpdate(req.employeeId,{$push:{studise:studies._id}})
      res.json(studies)
    } catch (error) {
      res.status(500).send(error.message)
    }
  })
  module.exports = router