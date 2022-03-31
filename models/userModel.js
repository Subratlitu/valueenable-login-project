const mongoose=require('mongoose');
const { stringify } = require('nodemon/lib/utils');

const userModel=new mongoose.Schema(
    {
        title:{
            type:String,
            required:"title is required",
            enum:["Mr","Mrs","Miss"]
        },
        name:{
            type:String,
            required:"name is required"
        },
        phone:{
            type: String,
            unique:true,
            required:"mobile is required",
            match: /^([+]\d{2})?\d{10}$/
        },
        email:{
            type: String,
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
        password:{
            type:String,
            required:"password is a required field",
            minlength:8,
            maxlength:15
        },
        address:{
            street:{type:String},
            city:{type:String},
            pincode:{type:String}
        }

    },{timestamps:true}
)

module.exports = mongoose.model('user', userModel);