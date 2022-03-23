const internModel=require('../models/internModel')
const collegeModel=require('../models/collegeModel')

const isValid=function(value){
    if(typeof value ==='undefined' || value===null)return false
    if(typeof value==='string' && value.trim().length===0)return false
    return true;
}
const isValidRequestBody=function(requestBody){
    return Object.keys(requestBody).length>0
}
const isValidObjectId=function(ObjectId){
    return mongoose.Types.ObjectId.isValid(ObjectId)
  }
const isRightFormatmobile = function (mobile) {
    return /^([+]\d{2})?\d{10}$/.test(mobile);
}


const createIntern=async function(req,res){
    try{
        const requestBody=req.body
        if(!isValidRequestBody(requestBody)){
            res.status(400).send({status:false,message:'invalid reqquest parameter.please provide intern details'})
            return
        }
        const{name,email,mobile,collegeId}=requestBody
        if(!isValid(name)){
            res.status(400).send({status:false,message:'name is missing!'})
            return
        }
        if(!isValid(email)){
            res.status(400).send({status:false,message:'email is missing!'})
            return
        }
        if(!isValid(mobile)){
            res.status(400).send({status:false,message:'mobile number is missing!'})
            return
        }
        if (!isRightFormatmobile(mobile)) { return res.status(400).send({ status: false, msg: "Please enter a valid mobile number" }) }

        let duplicateMobile= await internModel.findOne({mobile:mobile})
        if(duplicateMobile){ return res.status(400).send({status: false, msg: "Mobile number already exist"})}
    
        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
            res.status(400).send({status:false,message:'email is not valid'})
            return
        }
        const isEmailAlreadyUsed= await internModel.findOne({email})
        if(isEmailAlreadyUsed){
            res.status(400).send({status:false,message:`${email} email address is already is used`})
            return
        }
        if(!isValid(collegeId)){
            res.status(400).send({status:false,message:'college id is missing!'})
            return
        }
        if(!isValidObjectId){
            res.status(400).send({status:false,message:"this is not a valid college id"})
        }
        //validation end
        const internData={name,email,mobile,collegeId}
        const isMatch= await collegeModel.findById(collegeId)
        if(!isMatch){return res.status(400).send({status:false, msg:"please enter a valid college id"})}
        const newIntern=await internModel.create(internData)
        res.status(201).send({status:true,message:"intern created succesfully",data:newIntern})
    }catch (error) {
        res.status(500).json({status:false, error:error.message})
    }


}

const getInterns=async function(req,res){
    try{
        let cName=req.query.name
        if(!cName){return res.status(400).send({status:false,message:"college name is required"})}
        let validCollege=await collegeModel.findOne({name:cName})
        if(!validCollege){return res.status(400).send({status:false,message:"college is not exits"})}
        let cId= await collegeModel.find({name:cName}).select({_id:1})
        let interns=await internModel.find({collegeId:cId}).select({name:1,email:1,mobile:1})
        let result=await collegeModel.find({name:cName}).select({_id:0,name:1,fullName:1,logoLink:1})
        let obj={
            name:result[0].name,
            fullName:result[0].fullName,
            logoLink:result[0].logoLink,
            interests:interns
        }
        
        res.status(201).send({status:true,message:"success",data:obj})
        


    }catch (error) {
        res.status(500).json({status:false, error:error.message})
    }
}
module.exports={
    createIntern,
    getInterns
}