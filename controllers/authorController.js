const authorModel = require('../models/authorModel');
const jwt = require('jsonwebtoken');

const isValid=function(value){
    if(typeof value ==='undefined' || value===null)return false
    if(typeof value==='string' && value.trim().length===0)return false
    return true;
}
const isValidTitle=function(title){
    return['Mr','Mrs','Miss'].indexOf(title) !== -1
}
const isValidRequestBody=function(requestBody){
    return Object.keys(requestBody).length>0
}
//creating author
const createAuthor = async function(req,res){
    try {
        const requestBody=req.body
        if(!isValidRequestBody(requestBody)){
            res.status(400).send({status:false,message:'invalid reqquest parameter.please provide author details'})
            return
        }
        const{fname,lname,title,email,password}=requestBody

        if(!isValid(fname)){
            res.status(400).send({status:false,message:'first name is required'})
            return
        }
        if(!isValid(lname)){
            res.status(400).send({status:false,message:'last name is required'})
            return
        }
        if(!isValid(title)){
            res.status(400).send({status:false,message:'title is required'})
            return
        }
        if(!isValidTitle(title)){
            res.status(400).send({status:false,message:'title should be among mr ,miss,mrs'})
            return
        }
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

        const isEmailAlreadyUsed= await authorModel.findOne({email})
        if(isEmailAlreadyUsed){
            res.status(400).send({status:false,message:`${email} email address is already is used`})
            return
        }
        // validation end
        const authorData={fname,lname,title,email,password}
        const newAuthor= await authorModel.create(authorData)
        res.status(201).send({status:true,message:'author created successfully',data:newAuthor})


    } catch (error) {
        res.status(500).json({status:false, error:error.message})
        
        
    }
    

}

//author login
const authorLogIn = async(req,res)=>{
    try {
        const requestBody=req.body
        if(!isValidRequestBody(requestBody)){
            res.status(400).send({status:false,message:'invalid reqquest parameter.please provide author details'})
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
        const author=await authorModel.findOne({email,password})
        if(!author){
            res.status(400).send({status:false,message:'invalid logon credential'})
            return
        }

    

    const token = jwt.sign({
        authorId: author._id,
        iat:Math.floor(Date.now()/1000),
        exp:Math.floor(Date.now()/1000)+10*60*60
     },"functionup-project");
    res.setHeader('x-api-key',token);
    res.status(200).json({status:true,message:"author login succesfully", data:token});
    } catch (error) {
        res.status(500).json({ msg: "Error", Error: error.message });
    }

}






module.exports = {
    createAuthor,
    authorLogIn
}