const mongoose=require('mongoose');

// defining new schema
const userModel=new mongoose.Schema(
    {
        name:{
            type:String,
            required:"name is required"
        },
        role:{
            type:String,
            required:"role is required",
            enum:["admin","customer","moderator"]// user should enter role value among this
        },
        phone:{
            type: String,
            unique:true,
            required:"mobile is required"
        },
        email:{
            type: String,
            required: 'email address is required',
            lowercase:true,
            trim:true,
            unique: true
        },
        password:{
            type:String,
            required:"password is a required field",
            minlength:8,
            maxlength:15
        }

    },{timestamps:true}
)

module.exports = mongoose.model('user', userModel);// exporting this file 