const authorModel = require('../models/authorModel');
const jwt = require('jsonwebtoken');

//creating author
const createAuthor = async function(req,res){
    try {
        if(Object.keys(req.body).length!= 0){
            let authors = await authorModel.create(req.body);
            res.status(201).json({status:true, data:authors});
        }
        else{
            res.status(400).json({status:false, msg:"Bad Request!"});
        }
        
    } catch (error) {
        res.status(500).json({status:false, error:error.message})
        
    }
    

}

//author login
const authorLogIn = async(req,res)=>{
    try {
    let email = req.body.email;
    let password = req.body.password;
    let author = await authorModel.findOne({ email: email, password: password });
    if (!author)
    return res.status(400).send({status: false,msg: "username or the password is not corerct"});

    const token = jwt.sign({authorId: author._id },"functionup-project");
    res.setHeader('x-api-key',token);
    res.status(200).json({status:true, data:token});
    } catch (error) {
        res.status(500).json({ msg: "Error", Error: error.message });
    }

}






module.exports = {
    createAuthor,
    authorLogIn
}