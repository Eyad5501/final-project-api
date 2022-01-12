// const jwt=require("jsonwebtoken")

// const {Company} = require("../models/Company")
// const {Employee} = require("../models/Employee")


// const checkTokenCandE= async(req,res,next)=>{
//       try{
//         const token =req.header("Authorization")
//         if(!token) return res.status(401).json("token is required")
//         const decryptedToken =jwt.verify(token,process.env.JWT_SECRET_KEY)
//         const companyId= decryptedToken.id
//         const employeeId= decryptedToken.id
//         const company = await Company.findById(companyId)
//         const AdminCE=await Employee.findById(employeeId)
//         if(!company&&!AdminCE) return res.status(404).json("company and employee not found")

//         req.companyId=companyId
//         next()
//       }catch (error) {
//         console.log(error)
//         res.status(500).send(error.message)
//       }
// }
// module.exports= checkTokenCandE