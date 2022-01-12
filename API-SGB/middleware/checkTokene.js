const jwt=require("jsonwebtoken")

const {Employee} = require("../models/Employee")

const checkTokene= async(req,res,next)=>{
      try{
        const token =req.header("Authorization")
        if(!token) return res.status(401).json("token is required")

        const decryptedToken =jwt.verify(token,process.env.JWT_SECRET_KEY)
        const employeeId= decryptedToken.id


        const employee = await Employee.findById(employeeId)

        if(!employee) return res.status(404).json("employee not found")

        req.employeeId=employeeId
        next()
      }catch (error) {
        console.log(error)
        res.status(500).send(error.message)
      }
}
module.exports= checkTokene