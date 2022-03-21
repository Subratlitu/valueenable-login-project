const mongoose = require('mongoose');

const authorModel = new mongoose.Schema(
    {
        fname: {type: String, required:'first name is required',trim:true},
        lname : {type: String, required:'last name is required',trim:true},
        title: {type: String, enum:['Mr','Mrs','Miss'], required:'title is required'},
        email : {type: String,
            required: 'email address is required',
            lowercase:true,
            trim:true,
            unique: true,
            validate:{
                validator:function(email){
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
                },message:"please fill a valid mail adress",isAsync:false
            }
            }, 
        password: {type:String,trim:true,required:'password is required'}



    },{timestamps: true}
)

module.exports = mongoose.model('Author', authorModel);





