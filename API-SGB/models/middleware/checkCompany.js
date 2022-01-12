const jwt=require("jsonwebtoken")

const {Company} = require("../models/Company")

const checkCompany= async(req,res,next)=>{
      try{
        const token =req.header("Authorization")
        if(!token) return res.status(401).json("token is required")

        const decryptedToken =jwt.verify(token,process.env.JWT_SECRET_KEY)
        const companyId= decryptedToken.id


        const company= await Company.findById(companyId)

        if(!company) return res.status(404).json("company not found")

        req.companyId=companyId
        next()
      }catch (error) {
        console.log(error)
        res.status(500).send(error.message)
      }
}
module.exports= checkCompany