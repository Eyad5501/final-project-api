const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const Joi = require("joi")
const JoiObjecId = require("joi-objectid")
Joi.objectid = JoiObjecId(Joi)
const users = require("./routes/users")
const companise = require("./routes/companise")
const orders = require("./routes/orders")
const employees = require("./routes/employees")
const studise = require("./routes/studise")
const fields = require("./routes/fields")
mongoose
  .connect(`mongodb://localhost:27017/SGB`)
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch(error => {
    console.log(" Error Connected to MongoDB", error)
  })
const app = express()
app.use(express.json())
app.use(cors())
app.use("/api/auth", users)
app.use("/api/company", companise)
app.use("/api/order", orders)
app.use("/api/employee", employees)
app.use("/api/Study", studise)
app.use("/api/Field", fields)

const port = 5000
app.listen(port, () => console.log("server is listening on port:" + port))

// app.listen(5000, () => {
//   console.log("server is listening on port:" + 5000)
// })
