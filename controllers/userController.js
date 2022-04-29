const { status } = require("express/lib/response");
const userModel = require("../models/userModel")
const jwt = require('jsonwebtoken');


const isValid=function(value){
    if(typeof value ==='undefined' || value===null)return false
    if(typeof value==='string' && value.trim().length===0)return false
    return true;
}
const isValidRequestBody=function(requestBody){
    return Object.keys(requestBody).length>0
}
const isRightFormatmobile = function (phone) {
    return /^([+]\d{2})?\d{10}$/.test(phone);
}
const isValidTitle=function(title){
    return['Mr','Mrs','Miss'].indexOf(title) !== -1
}
const isValidPassword = function(password){
    return (password.length>=8 && password.length<=15)
    
}
const registerUser=async function(req,res){
    try{
        const requestBody=req.body
        if(!isValidRequestBody(requestBody)){
            res.status(400).send({status:false,message:"invalid reqquest parameter.please provide user details"})
            return
        }
        const{title,name,phone,email,password,address} = requestBody;

        if(!isValid(name)){
            res.status(400).send({status:false,message:"name is missing"})
            return
        }

        if(!isValid(title)){
            res.status(400).send({status:false,message:"title is missing"})
            return
        }
        if(!isValidTitle(title)){
            res.status(400).send({status:false,message:"title should be among Mr,Miss,Mrs"})
            return
        }


        if(!isValid(phone)){
            res.status(400).send({status:false,message:"phone is missing"})
            return
        }
        if(!isRightFormatmobile(phone)){
            res.status(400).send({status:false,message:"Please enter valid mobile number"})
            return
        }

        
        if(!isValid(email)){
            res.status(400).send({status:false,message:"email is missing"})
            return
        }
        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
            res.status(400).send({status:false,message:'email is not valid'})
            return
        }

        if(!isValid(password)){
            res.status(400).send({status:false,message:"password is missing"})
            return
        }
        if(!isValidPassword(password)){
            res.status(400).send({status:false,message:"your password is not valid. please give a length in 8-15 "})
            return
        }


        if(!isValid(address)){
            res.status(400).send({status:false,message:"address is missing"})
            return
        }


        const isEmailAlreadyUsed= await userModel.findOne({email:email})
        if(isEmailAlreadyUsed){
            res.status(400).send({status:false,message:`${email} email address is already is used`})
            return
        }
        const duplicateMobile= await userModel.findOne({phone:phone})
        if(duplicateMobile){
             res.status(400).send({status: false, msg: "Mobile number already exist"})
             return}

        //validation end
        const userData={title,name,phone,email,password,address}

        const newUser=await userModel.create(userData)
        res.status(201).send({status:true,message:"user created succesfully",data:newUser})


    }catch (error) {
        res.status(500).json({status:false, error:error.message})
        
        
    }
   
}
//author login
const userLogIn = async(req,res)=>{
    try {
        const requestBody=req.body
        if(!isValidRequestBody(requestBody)){
            res.status(400).send({status:false,message:'invalid reqquest parameter.please provide user details'})
            return
        }
        const{email,password}=requestBody
        if(!isValid(email)){
            res.status(400).send({status:false,message:'email is required'})
            return
        }
        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
            res.status(400).send({status:false,message:'email is not valid'})
            return
        }
        if(!isValid(password)){
            res.status(400).send({status:false,message:'password is required'})
            return
        }
        if(!isValidPassword(password)){
            res.status(400).send({status:false,message:"please enter a valid password"})
            return
        }
        const user=await userModel.findOne({email:email,password:password})
        if(!user){
            res.status(400).send({status:false,message:'invalid logon credential'})
            return
        }

    

    const token = jwt.sign({
        userId: user._id,
        iat:Math.floor(Date.now()/1000),
        exp:Math.floor(Date.now()/1000)+10*60*60
     },"book-management-project");
    res.setHeader('x-api-key',token);
    res.status(200).json({status:true,message:"user login succesfully", data:token});
    } catch (error) {
        res.status(500).json({ msg: "Error", Error: error.message });
    }

}






module.exports = {
    registerUser,
    userLogIn
}

