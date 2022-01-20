const express = require("express")
const checkAdmin = require("../middleware/checkAdmin")
const checkAdminemployee = require("../middleware/checkAdminemployee")
const checkId = require("../middleware/checkId")
// const checkTokene = require("../middleware/checkTokene")
const validateBody = require("../middleware/validateBody")
const { Field, fieldJoi } = require("../models/Field")
const router = express.Router()

router.get("/", async (req, res) => {
  const fields = await Field.find()
  res.json(fields)
})
// router.get("/:companyid/:Filed", checkTokene, async (req, res) => {
//   try {
//     const employees = await Employee.find({ companyid: req.params.companyid })
//     const employeeField = employees.filter(employee => employee.fields.inclodes(req.params.Filed))
//     res.json(employeeField)
//   } catch (error) {
//     console.log(error)
//     res.status(500).send(error.message)
//   }
// })
router.post("/",checkAdmin,validateBody(fieldJoi), async (req, res) => {
  try {
    const { typeField ,photo} = req.body

    const field = new Field({
      typeField,photo
    })
    await field.save()
    res.json(field)
  } catch (error) {
    res.status(500).send(error.message)
  }
})
router.put("/:id",checkAdminemployee, checkId, validateBody(fieldJoi),async (req, res) => {
  try {
    const { typeField,photo } = req.body

    const field = await Field.findByIdAndUpdate(req.params.id, { $set: { typeField,photo } }, { new: true })
    if (!Field) return res.status(404).send("Field not found")

    res.json(field)
  } catch (error) {
    res.status(500).send(error)
  }
})
router.delete("/:id",checkAdmin, checkId, async (req, res) => {
  try {
    const field = await Field.findByIdAndRemove(req.params.id)
    if (!field) return res.status(404).send("field not found")

    res.send("field removed")
  } catch (error) {
    res.status(500).send(error)
  }
})
module.exports = router
