const express = require("express")
const checkAdmin = require("../middleware/checkAdmin")
const checkCompany = require("../middleware/checkCompany")
const checkEmployee = require("../middleware/checkAdminemployee")
const checkId = require("../middleware/checkId")
const { Order, OrderAddJoi, OrderEditJoi } = require("../models/Order")
const validateBody = require("../middleware/validateBody")
const checkTokenu = require("../middleware/checkTokenu")
const checkTokene = require("../middleware/checkTokene")
const checkTokenc = require("../middleware/checkTokenc")
const { Company } = require("../models/Company")
const { User } = require("../models/User")
const nodemailer = require("nodemailer")

const { Employee } = require("../models/Employee")
const { Study } = require("../models/Study")
const router = express.Router()
//Order
router.get("/", async (req, res) => {
  const orders = await Order.find()
    .populate("nameP")
    .populate("posterP")
    .populate({ path: "companyid", populate: { path: "employees" } })
    .populate("fieldid")
    .populate("userid")
  res.json(orders)
})
router.get("/:id", checkId, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) return res.status(404).send("order not found")
    res.json(order)
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
})
router.get("/:orderid", checkCompany, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderid)

    if (!order) return res.status(404).send("order not found")

    const orderfound = await Order.findByIdAndUpdate(
      req.params.orderid,
      { $set: { orderstatus: "completed" } },
      { new: true }
    )
    res.json(orderfound)
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
})
router.post("/:companyid/order/:fieldid", checkTokenu, validateBody(OrderAddJoi), async (req, res) => {
  try {
    const { nameP, descriptionP, posterP, areaP, LocationP, employeeid, fieldid } = req.body
    const order = new Order({
      nameP,
      descriptionP,
      posterP,
      areaP,
      LocationP,
      companyid: req.params.companyid,
      employeeid,
      userid: req.userId,
      fieldid: req.params.fieldid,
    })
    await order.save()
    await Company.findByIdAndUpdate(req.params.companyid, { $push: { orders: order._id } })
    await User.findByIdAndUpdate(req.userId, { $push: { orders: order._id } })
    

    // here
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: "eyaz07873@gmail.com",
        pass: `${process.env.GMAIL_PASS}`,
      },
    })

    await transporter.sendMail({
      from: '"Eyad Ahmed" <eyaz07873@gmail.com>',
      // to: study.uesrid.email,
      to: "eyaz07873@gmail.com",

      subject: "Study completed",
      html: ` Study completed`,
    })

    res.json(order)
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
})

// router.post("/:companyid", checkTokenu, validateBody(OrderAddJoi), async (req, res) => {
//   try {

//     const { nameP, descriptionP, posterP, areaP, LocationP,employeeid,fieldid,} = req.body
//     const order = new Order({
//       nameP,
//       descriptionP,
//       posterP,
//       areaP,
//       LocationP,
//       companyid:req.params.companyid,
//       employeeid,
//       userid: req.userId,
//       fieldid,

//     })
//     await order.save()
//     await Company.findByIdAndUpdate(req.params.companyid,{$push:{orders:order._id}})
//     await User.findByIdAndUpdate( req.userId,{$push:{orders:order._id}})

//     res.json(order)
//   } catch (error) {
//     console.log(error)
//     res.status(500).send(error.message)
//   }
// })

router.put("/:id/assignemp", checkId, checkTokenc, validateBody(OrderEditJoi), async (req, res) => {
  try {
    const { employeeid } = req.body

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { employeeid: employeeid, orderstatus: "progress" } },
      { new: true }
    )
    if (!order) return res.status(404).send("order not found")
    const employee = await Employee.findByIdAndUpdate(employeeid, { $push: { orders: order._id } })


    here
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: "eyaz07873@gmail.com",
        pass: `${process.env.GMAIL_PASS}`,
      },
    })

    await transporter.sendMail({
      from: '"Mohmmad Ahmed" <eyaz07873@gmail.com>',
      to: employee.email,
      // to: "mjdyalzhrany224@icloud.com",
      subject: "Study  ",
      html: ` Study completed`,
    })

    res.json(order)
  } catch (error) {
    res.status(500).send(error)
  }
})
router.put("/:orderid/completestudy/:studyid", checkTokene, async (req, res) => {
  try {
    const study = await Study.findById(req.params.studyid).populate("uesrid").populate("companyid")
    const order = await Order.findByIdAndUpdate(
      req.params.orderid,
      { $set: { orderstatus: "completed", study: study.study } },
      { new: true }
    )
    if (!order) return res.status(404).send("order not found")

    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: "eyaz07873@gmail.com",
        pass: `${process.env.GMAIL_PASS}`,
      },
    })

    await transporter.sendMail({
      from: '"Mohmmad Ahmed" <eyaz07873@gmail.com>',
      // to: study.uesrid.email,
      to: "eyaz07873@gmail.com",
      subject: "Study completed",
      html: ` Study completed`,
    })

    await transporter.sendMail({
      from: '"Mohmmad Ahmed" <eyaz07873@gmail.com>',
      // to: study.companyid.email,
      to: "eyaz07873@dfgtgtgtgtgt.com",
      subject: "Study completed",
      html: ` Study completed`,
    })


    res.json(order)
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
})
router.put("/:id", checkId, checkAdmin, validateBody(OrderEditJoi), async (req, res) => {
  try {
    const { nameP, descriptionP, posterP, areaP, LocationP } = req.body

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { nameP, descriptionP, posterP, areaP, LocationP } },
      { new: true }
    )
    if (!order) return res.status(404).send("order not found")

    res.json(order)
  } catch (error) {
    res.status(500).send(error)
  }
})
router.delete("/:id", checkAdmin, checkId, async (req, res) => {
  try {
    const order = await Order.findByIdAndRemove(req.params.id)
    if (!order) return res.status(404).send("order not found")

    res.send("orders remove")
  } catch (error) {
    res.status(500).send(error)
  }
})

module.exports = router
