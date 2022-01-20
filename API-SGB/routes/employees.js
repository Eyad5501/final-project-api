const express = require("express")
const checkAdminemployee = require("../middleware/checkAdminemployee")
const nodemailer = require("nodemailer")
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const {
  Employee,
  employeeAddJoi,
  employeeEditJoi,
  employeesignUpJoi,
  employeeloginJoi,
  employeeprofileJoi,
} = require("../models/Employee")
const checkId = require("../middleware/checkId")
const validateBody = require("../middleware/validateBody")
const checkTokene = require("../middleware/checkTokene")
const checkAdmin = require("../middleware/checkAdmin")
const checkTokenc = require("../middleware/checkTokenc")
const { Company } = require("../models/Company")

router.get("/", async (req, res) => {
  const employees = await Employee.find().populate("fields").populate("orders").populate("companyid")
  res.json(employees)
})
// router.get("/:id", checkId, async (req, res) => {
//   try {
//     const employee = await Employee.findById(req.params.id).populate("fields")
//     if (!employee) return res.status(404).send("employee not found")
//     res.json(employee)
//   } catch (error) {
//     console.log(error)
//     res.status(500).send(error.message)
//   }
// })
router.get("/:companyid/:Filed", checkTokene, async (req, res) => {
  try {
    const employees = await Employee.find({ companyid: req.params.companyid })
    const employeeField = employees.filter(employee => employee.fields.inclodes(req.params.Filed))
    res.json(employeeField)
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
})
router.post("/", checkTokenc, validateBody(employeeAddJoi), async (req, res) => {
  try {
    const { firstName, lastName, photo, phone, email, studise, fields, companyid, password } = req.body

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const employee = new Employee({
      firstName,
      lastName,
      photo,
      phone,
      email,
      studise,
      fields,
      password: hash,
      companyid: req.companyid,
      role: "Employee",
    })

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
      from: '"Mohmmad Ahmed" <test3705968@gmail.com>',
      to: email,
      subject: "Company account created",

      html: `email company: ${email}
      <br>
      password: ${password} `,
    })

    await employee.save()

    await Company.findByIdAndUpdate(req.companyid, { $push: { employees: employee._id } }, { new: true })

    res.json(employee)
  } catch (error) {
    res.status(500).send(error.message)
  }
})
// router.put("/:id", checkId, checkAdmin, validateBody(employeeEditJoi), async (req, res) => {
//   try {
//     const { firstName, lastName, photo, phone, email, studise, fields } = req.body

//     const employee = await Employee.findByIdAndUpdate(
//       req.params.id,
//       { $set: { firstName, lastName, photo, phone, email, studise, fields } },
//       { new: true }
//     )
//     if (!employee) return res.status(404).send("employee not found")

//     res.json(employee)
//   } catch (error) {
//     res.status(500).send(error)
//   }
// })
router.delete("/:id", checkId, checkAdmin, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndRemove(req.params.id)
    if (!employee) return res.status(404).send("employee not found")
    res.send("employees remove")
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
})

router.post("/login", validateBody(employeeloginJoi), async (req, res) => {
  try {
    const { email, password } = req.body

    const employee = await Employee.findOne({ email })
    if (!employee) return res.status(404).json("employee not regidtered")

    const valid = await bcrypt.compare(password, employee.password)
    if (!valid) return res.status(400).send("password incorrect")

    const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })
    res.json(token)
  } catch (error) {
    res.status(500).json(error.message)
  }
})
router.get("/profile", checkTokene, async (req, res) => {
  try {
    const employee = await Employee.findById(req.employeeId)
      .select("-__v -password")
      .populate({
        path: "orders",
        populate: [
          {
            path: "userid",
            select: "-password -email -role",
          },
          {
            path: "companyid",
          },
        ],
      })

      .populate({
        path: "studise",
        populate: [
          {
            path: "uesrid",
            select: "-password -email -role",
          },
          ,
          {
            path: "orderid",
          },
        ],
      })
      .populate("phone")

    res.json(employee)
  } catch (error) {
    res.status(500).json(error.message)
  }
})
router.put("/profile", checkTokene, validateBody(employeeprofileJoi), async (req, res) => {
  const { firstName, lastName, password, photo, phone } = req.body

  let hash
  if (password) {
    const salt = await bcrypt.genSalt(10)
    hash = await bcrypt.hash(password, salt)
  }

  const employee = await Employee.findByIdAndUpdate(
    req.employeeId,
    { $set: { firstName, lastName, password: hash, photo, phone } },
    { new: true }
  ).select("-__v -password")
  res.json(employee)
})
// router.post("/login/admin", validateBody(employeeloginJoi), async (req, res) => {
//   try {
//     const { email, password } = req.body
//     const employee = await Employee.findOne({ email })
//     if (!employee) return res.status(404).send("employee not found")
//     if (employee.role != "Admin") return res.status(430).send(" you are not admin")

//     const valid = await bcrypt.compare(password, employee.password)
//     if (!valid) return res.status(400).send("password incorrect")

//     const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })

//     res.send(token)
//   } catch (error) {
//     res.status(500).send(error.message)
//   }
// })
// router.post("/add-admin", checkAdminemployee, async (req, res) => {
//   try {
//     const { firstName, lastName, email, password, avatar } = req.body

//     const result = signUpJoi.validate(req.body)
//     if (result.error) return res.status(400).send(result.error.details[0].message)

//     const employeeFound = await Employee.findOne({ email })
//     if (employeeFound) return res.status(400).send("user already registered")

//     const salt = await bcrypt.genSalt(10)
//     const hash = await bcrypt.hash(password, salt)

//     const employee = new Employee({
//       firstName,
//       lastName,
//       email,
//       password: hash,
//       avatar,
//       role: "Admin",
//     })

//     await employee.save()

//     delete employee._doc.password

//     res.json(employee)
//   } catch (error) {
//     res.status(500).send(error.message)
//   }
// })

module.exports = router
