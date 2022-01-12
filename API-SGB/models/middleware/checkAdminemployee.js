const jwt = require("jsonwebtoken")
const { Employee } = require("../models/Employee")
const { User } = require("../models/User")


const checkAdminemployee = async (req, res, next) => {
  try {
    const token = req.header("Authorization")
    if (!token) return res.status(401).send("token is missing")

    const decryptedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const userId = decryptedToken.id

    const employee = await Employee.findById(userId)

    const adminFound = await User.findById(userId)

    if (adminFound.role !== "Admin" && !employee) return res.status(403).send("you are not admin or employee")
    req.userId = userId
    next()
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
}

module.exports = checkAdminemployee
