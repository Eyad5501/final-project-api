const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const nodemailer=require("nodemailer")
const bcrypt = require("bcrypt")
const { User, signUpJoi, loginJoi, profileJoi } = require("../models/User")
const { Company,companyAddJoi } = require("../models/Company")
const checkTokenu = require("../middleware/checkTokenu.js")
const validateBody = require("../middleware/validateBody")
const checkAdmin = require("../middleware/checkAdmin")
const checkId = require("../middleware/checkId")
router.get("/", async (req, res) => {
  const users = await User.find()
  res.json(users)
})
router.post("/signup", validateBody(signUpJoi), async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, avatar } = req.body

    const userFound = await User.findOne({ email })
    if (userFound) return res.status(400).send("user already registered")

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password: hash,
      avatar,
      role: "User",
    })

    await user.save()

    delete user._doc.password

    res.json(user)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.post("/login", validateBody(loginJoi), async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json("user not regidtered")

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(400).send("password incorrect")

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })
    res.json(token)
  } catch (error) {
    res.status(500).json(error.message)
  }
})
router.get("/profile", checkTokenu, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-__v -password").populate("orders")

    res.json(user)
  } catch (error) {
    res.status(500).json(error.message)
  }
})
router.put("/profile", checkTokenu, validateBody(profileJoi), async (req, res) => {
  const { firstName, lastName, password, avatar, phone } = req.body

  let hash
  if (password) {
    const salt = await bcrypt.genSalt(10)
    hash = await bcrypt.hash(password, salt)
  }

  const user = await User.findByIdAndUpdate(
    req.userId,
    { $set: { firstName, lastName, password: hash, avatar, phone } },
    { new: true }
  ).select("-__v -password")
  res.json(user)
})
router.post("/login/admin", validateBody(loginJoi), async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).send("user not found")
    if (user.role != "Admin") return res.status(430).send(" you are not admin")

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(400).send("password incorrect")

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })

    res.send(token)
  } catch (error) {
    res.status(500).send(error.message)
  }
})
router.post("/add-admin", checkAdmin, async (req, res) => {
  try {
    const { firstName, lastName, email, password, avatar,phone } = req.body

    const result = signUpJoi.validate(req.body)
    if (result.error) return res.status(400).send(result.error.details[0].message)

    const userFound = await User.findOne({ email })
    if (userFound) return res.status(400).send("user already registered")

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = new User({
      firstName,
      lastName,
      email,
      password: hash,
      avatar,
      phone,
      role: "Admin",
    })

    await user.save()

    delete user._doc.password

    res.json(user)
  } catch (error) {
    res.status(500).send(error.message)
  }
})
router.post("/add-Company", checkAdmin, async (req, res) => {
  try {
    const { nameCompany, email, password, photo } = req.body

    const result = companyAddJoi.validate(req.body)
    if (result.error) return res.status(400).send(result.error.details[0].message)

    const companyFound = await Company.findOne({ email })
    if (companyFound) return res.status(400).send("Company already registered")

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const company = new Company({
      nameCompany,
      email,
      password: hash,
      photo,
      role: "Company",
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
    await company.save()

    delete company._doc.password

    res.json(company)
  } catch (error) {
    res.status(500).send(error.message)
  }
})
router.get("/users", checkAdmin, async (req, res) => {
  const users = await User.find().select("-password -__v")
  res.json(users)
})
router.delete("/users/:id",checkId, checkAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).send("user not found")

    if (user.role === "Admin") return res.status(403).send("unauthorized action")

    await User.findByIdAndRemove(req.params.id)

    // await Comment.deleteMany({ owner: req.params.id })

    res.send("user is deleted")
  } catch (error) {
    res.status(500).send(error.message)
  }
})
module.exports = router
