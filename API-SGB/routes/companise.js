const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const checkTokenCandE = require("../middleware/checkTokenCandE")
const checkId = require("../middleware/checkId")
const {
  Company,
  companyAddJoi,
  companyEditJoi,
  ratingJoi,
  companyloginJoi,
  companyprofileJoi,
  companyAddCompanyPJoi,
} = require("../models/Company")
const validateId = require("../middleware/validateId")
const { User } = require("../models/User")
const checkAdmin = require("../middleware/checkAdmin")
const checkAdminemployee = require("../middleware/checkAdminemployee")
const checkCompany = require("../middleware/checkCompany")
const validateBody = require("../middleware/validateBody")
const checkTokenu = require("../middleware/checkTokenu")
const { Employee, employeesignUpJoi } = require("../models/Employee")
const { Comment, commentJoi } = require("../models/Comment")
const checkTokenc = require("../middleware/checkTokenc")

router.get("/", async (req, res) => {
  const companise = await Company.find()
    .populate("employees")
    .populate("photo")
    .populate("fields")
    .populate({
      path: "orders",
      populate: {
        path: "userid",
        select: "-password -email -role",
      },
    })
    .populate({
      path: "orders",
      populate: {
        path: "fieldid",
      },
    })
    .populate({
      path: "comments",
      populate: {
        path: "owner",
        select: "-password -email -role",
      },
    })
  res.json(companise)
})
router
  .get("/profile", checkTokenc, async (req, res) => {
    try {
      const company = await Company.findById(req.companyid)
        .select("-__v -password")
        .populate({
          path: "orders",
          populate: {
            path: "userid",
            select: "-password -email -role",
          },
        })
        .populate({
          path: "orders",
          populate: {
            path: "fieldid",
          },
        })
        .populate("employees").populate("photo")
      res.json(company)
    } catch (error) {
      res.status(500).json(error.message)
    }
  })

router.put("/profile", checkTokenc, validateBody(companyprofileJoi), async (req, res) => {
  const { nameCompany, email, password, photo, fields } = req.body

  let hash
  if (password) {
    const salt = await bcrypt.genSalt(10)
    hash = await bcrypt.hash(password, salt)
  }

  const company = await Company.findByIdAndUpdate(
    req.companyid,
    { $set: { nameCompany, email, password, photo, fields } },
    { new: true }
  ).select("-__v -password")
  res.json(company)
})
router.get("/:id", checkId, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate("employees")
      .populate({
        path: "comments",
        populate: {
          path: "owner",
          select: "-password -email -likes -role",
        },
      })
    if (!company) return res.status(404).send("company not found")
    res.json(company)
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
})
router.post("/addPosted", checkCompany, validateBody(companyAddCompanyPJoi), async (req, res) => {
  try {
    const { nameCompany, employees, fields, photo } = req.body
    // const employeesSet = new Set(employees)
    // if (employeesSet.size < employees.length) return res.status(400).send("threr is a duplicated employee")
    // const employeesFound = await Employee.find({ _id: { $in: employees } })
    // if (employeesFound.length < employees.length) return res.status(404).send("some of the employees is not found")
    // const fieldsSet = new Set(fields)
    // if (fieldsSet.size < fields.length) return res.status(400).send("threr is a duplicated field")
    // const fieldsFound = await Genre.find({ _id: { $in: fields }, type: "Genre" })
    // if (fieldsFound.length < fields.length) return res.status(404).send("some of the fields is not found")
    const company = await Company({
      nameCompany,
      employees,
      fields,
      photo,
    })
    await company.save()
    res.json(company)
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
})
router.put("/:id", checkAdmin, validateBody(companyEditJoi), async (req, res) => {
  try {
    const { nameCompany, employees, photo, fields } = req.body
    if (employees) {
      const employeesSet = new Set(employees)
      if (employeesSet.size < employees.length) return res.status(400).send("threr is a duplicated employee")
      const employeesFound = await Company.find({ _id: { $in: employees }, type: "Employees" })
      if (employeesFound.length > employees.length) return res.status(404).send("some of the employees is not found")
    }
    // if (fields) {
    //   const fieldsSet = new Set(fields)
    //   if (fieldsSet.size < fields.length) return res.status(400).send("threr is a duplicated field")
    //   const fieldsFound = await Genre.find({ _id: { $in: fields }, type: "Genre" })
    //   if (fieldsFound.length < fields.length) return res.status(404).send("some of the fields is not found")
    // }
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: { nameCompany, employees, fields, photo } },
      { new: true }
    )
    if (!company) return res.status(404).send("company not found")
    res.json(company)
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
})

router.delete("/:id", checkAdmin, checkCompany, checkId, async (req, res) => {
  try {
    const company = await Company.findByIdAndRemove(req.params.id)
    if (!company) return res.status(404).send("company not found")
    res.send("companise remove")
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
})
/* Comments */

router.get("/:companyid/comments", validateId("companyid"), async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyid)
    if (!company) return res.status(404).send("company not found")

    const comments = await Comment.find({ companyid: req.params.companyid })
    res.json(comments)
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
})

router.post(
  "/:companyid/comments",
  checkTokenu,
  validateId("companyid"),
  validateBody(commentJoi),
  async (req, res) => {
    try {
      const { comment } = req.body

      const company = await Company.findById(req.params.companyid)
      if (!company) return res.status(404).send("company not found")

      const newComment = new Comment({ comment, owner: req.userId, companyid: req.params.companyid })

      await Company.findByIdAndUpdate(req.params.companyid, { $push: { comments: newComment._id } })

      await newComment.save()

      res.json(newComment)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.message)
    }
  }
)

router.put(
  "/:companyid/comments/:commentId",
  checkTokenu,
  validateId("companyid", "commentId"),
  validateBody(commentJoi),
  async (req, res) => {
    try {
      const company = await Company.findById(req.params.companyid)
      if (!company) return res.status(404).send("company not found")
      const { comment } = req.body

      const commentFound = await Comment.findById(req.params.commentId)
      if (!commentFound) return res.status(404).send("comment not found")

      if (commentFound.owner != req.userId) return res.status(403).send("unauthorized action")

      const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId, { $set: { comment } }, { new: true })

      res.json(updatedComment)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.message)
    }
  }
)

router.delete(
  "/:companyid/comments/:commentId",
  checkTokenu,
  validateId("companyid", "commentId"),
  async (req, res) => {
    try {
      const company = await Company.findById(req.params.companyid)
      if (!company) return res.status(404).send("company not found")

      const commentFound = await Comment.findById(req.params.commentId)
      if (!commentFound) return res.status(404).send("comment not found")

      const user = await User.findById(req.userId)

      if (user.role !== "Admin" && commentFound.owner != req.userId) return res.status(403).send("unauthorized action")

      await Company.findByIdAndUpdate(req.params.companyid, { $pull: { comments: commentFound._id } })

      await Comment.findByIdAndRemove(req.params.commentId)

      res.send("comment is removed")
    } catch (error) {
      console.log(error)
      res.status(500).send(error.message)
    }
  }
)
/* Rating */

router.post("/:companyid/ratings", checkTokenu, validateId("companyid"), validateBody(ratingJoi), async (req, res) => {
  try {
    let company = await Company.findById(req.params.companyid)
    if (!company) return res.status(404).send("company not found")

    const { rating } = req.body

    const newRating = {
      rating,
      userId: req.userId,
    }

    const ratingFound = company.ratings.find(ratingObject => ratingObject.userId == req.userId)
    if (ratingFound) return res.status(400).send("user already rated this company")

    company = await Company.findByIdAndUpdate(req.params.companyid, { $push: { ratings: newRating } }, { new: true })

    let ratingSum = 0
    company.ratings.forEach(ratingObject => {
      ratingSum += ratingObject.rating
    })
    const ratingAverage = ratingSum / company.ratings.length

    await Company.findByIdAndUpdate(req.params.companyid, { $set: { ratingAverage } })

    res.send("rating added")
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
})
router.post("/add-employee", checkCompany, validateBody(employeesignUpJoi), async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password, photo } = req.body

    const employeesFound = await Employee.findOne({ email })
    if (employeesFound) return res.status(400).send("employees already registered")

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const employee = new Employee({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hash,
      photo,
      role: "Employee",
    })
    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: "test3705968@gmail.com",
    //     pass: `${process.env.GMAIL_PASS}`,
    //   },
    // })

    // await transporter.sendMail({
    //   from: '"Mohmmad Ahmed" <test3705968@gmail.com>',
    //   to: email,
    //   subject: "Email verification",

    //   html: ` `,
    // })

    await employee.save()
    await Company.findByIdAndUpdate(req.companyId, { $push: { employees: employee._id } })

    delete employee._doc.password

    res.json(employee)
  } catch (error) {
    res.status(500).send(error.message)
  }
})
router.post("/login", validateBody(companyloginJoi), async (req, res) => {
  try {
    const { email, password } = req.body

    const company = await Company.findOne({ email })
    if (!company) return res.status(404).json("company not regidtered")

    const valid = await bcrypt.compare(password, company.password)
    if (!valid) return res.status(400).send("password incorrect")

    const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })
    res.json(token)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

module.exports = router
