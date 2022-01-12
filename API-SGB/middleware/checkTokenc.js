const jwt=require("jsonwebtoken")

const {Company} = require("../models/Company")

const checkTokenc= async(req,res,next)=>{
      try{
        const token =req.header("Authorization")
        if(!token) return res.status(401).json("token is required")

        const decryptedToken =jwt.verify(token,process.env.JWT_SECRET_KEY)
        const companyid= decryptedToken.id


        const company = await Company.findById(companyid)

        if(!company) return res.status(404).json("company not found")

        req.companyid=companyid
        next()
      }catch (error) {
        console.log(error)
        res.status(500).send(error.message)
      }
}
module.exports= checkTokenc