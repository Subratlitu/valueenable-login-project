
const userModel = require("../models/userModel")// importing user model


// isValid function will check wheather a value is valid or empty string or not
const isValid=function(value){
    if(typeof value ==='undefined' || value===null)return false
    if(typeof value==='string' && value.trim().length===0)return false // checking wheather its empty string or not
    return true;
}

// This function is going to  request body is empty or not
const isValidRequestBody=function(requestBody){
    return Object.keys(requestBody).length>0
}

//This function will check mobile is valid or not 
const isRightFormatmobile = function (phone) {
    return /^([+]\d{2})?\d{10}$/.test(phone);
}

//This function will check email is valid or not 
const isValidemail=function(email){
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
}

//This function will check role should be among "admin","customer","moderator"
const isValidRole=function(role){
    return["admin","customer","moderator"].indexOf(role) !== -1
}

//This function will check password is valid or not 
const isValidPassword = function(password){
    return (password.length>=8 && password.length<=15)
    
}

// user registration api
const registerUser=async function(req,res){
    try{
        //extracting request body 
        const requestBody=req.body
        if(!isValidRequestBody(requestBody)){
            res.status(400).send({status:false,message:"invalid request parameter.please provide user details"})
            return
        }
        //extracting all fields from request body using destructring
        const{name,role,phone,email,password,address} = requestBody;
        
        // validation start
        if(!isValid(name)){
            res.status(400).send({status:false,message:"name is missing"})
            return
        }
        if(!isValid(role)){
            res.status(400).send({status:false,message:"role is missing"})
            return
        }
        if(!isValidRole(role)){
            res.status(400).send({status:false,message:"role should be among customer,admin,moderator"})
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
        if(!isValidemail(email)){
         res.status(400).send({status:false,message:"your email is not valid"})
        }

        if(!isValid(password)){
            res.status(400).send({status:false,message:"password is missing"})
            return
        }
        if(!isValidPassword(password)){
            res.status(400).send({status:false,message:"your password is not valid. please give a length in 8-15 "})
            return
        }

        // checking wheather email is already exist in database or not
        const isEmailAlreadyUsed= await userModel.findOne({email:email})
        if(isEmailAlreadyUsed){
            res.status(400).send({status:false,message:`${email} email address is already is used`})
            return
        }
        // checking wheather mobile is already exist in database or not
        const duplicateMobile= await userModel.findOne({phone:phone})
        if(duplicateMobile){
             res.status(400).send({status: false, msg: "Mobile number already exist"})
             return}

        //validation end
        const userData={name,role,phone,email,password,address}
        // creating data in database
        const newUser=await userModel.create(userData)
        res.status(201).send({status:true,message:"user created succesfully",data:newUser})


    }catch (error) {
        res.status(500).json({status:false, error:error.message})
        
        
    }
   
}
//author login
const userLogIn = async(req,res)=>{
    try {
        // validation start
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
        if(!isValidemail(email)){
            res.status(400).send({status:false,message:"your email is not valid"})
           }
        if(!isValid(password)){
            res.status(400).send({status:false,message:'password is required'})
            return
        }
        if(!isValidPassword(password)){
            res.status(400).send({status:false,message:"please enter a valid password"})
            return
        }
        // searching wheather an user exist with this email and password or not inside database
        const user=await userModel.findOne({email:email,password:password})
        if(!user){
            res.status(400).send({status:false,message:'invalid logon credential'})
            return
        }
        // if user is exist then extracting role of the user
        let role=user.role
        //checking wheather role is matching with "admin","customer","moderator"
        // ideally dash board will be appear here but this is a complete backend project
        if(role=="customer"){
            res.status(200).send({status:true,message:"Here customer dash board will be appear"})
        }
        if(role=="admin"){
            res.status(200).send({status:true,message:"Here admin dash board will be appear"})
        }
        if(role=="moderator"){
            res.status(200).send({status:true,message:"Here moderator dash board will be appear"})
        }
    } catch (error) {
        res.status(500).json({ msg: "Error", Error: error.message });
    }

}





// exporting these files
module.exports = {
    registerUser,
    userLogIn
}

