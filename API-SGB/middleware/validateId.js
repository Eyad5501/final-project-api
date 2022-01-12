const mongoose = require("mongoose")

const validateId = (...idArray) => {
  return async (req, res, next) => {
    try {
      idArray.forEach(idNmae => {
        const id = req.params[idNmae]
        if (!mongoose.Types.ObjectId.isValid(id))
          return res.status(400).send(`the path${idNmae} id is not a vaild object id`)
      })
      next()
    } catch (error) {
      console.log(error)
      res.status(500).send(error.message)
    }
  }
}
module.exports = validateId
