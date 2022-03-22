const collegeModel=require('../models/collegeModel')

const isValid=function(value){
    if(typeof value ==='undefined' || value===null)return false
    if(typeof value==='string' && value.trim().length===0)return false
    return true;
}
const isValidRequestBody=function(requestBody){
    return Object.keys(requestBody).length>0
}

const createCollege= async function(req,res){
    try{
        const requestBody=req.body
        if(!isValidRequestBody(requestBody)){
            res.status(400).send({status:false,message:'invalid reqquest parameter.please provide college details'})
            return
        }
        const{name,fullName,logoLink}=requestBody
        if(!isValid(name)){
            res.status(400).send({status:false,message:'name is missing!'})
            return
        }
        if(!isValid(fullName)){
            res.status(400).send({status:false,message:'full name is missing!'})
            return
        }
        if(!isValid(logoLink)){
            res.status(400).send({status:false,message:'logo link is missing!'})
            return
        }
        //validation end
        const collegeData={name,fullName,logoLink}
        const newCollege=await collegeModel.create(collegeData)
        res.status(201).send({status:true,message:"college created succesfully",data:newCollege})






    }catch (error) {
        res.status(500).json({status:false, error:error.message})
        
        
    }

}
module.exports={
    createCollege
}