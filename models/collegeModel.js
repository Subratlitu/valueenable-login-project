
const mongoose=require('mongoose');


const collegeModel=new mongoose.Schema(
    {
        name:{
            type:String,
            unique:true,
            required:"name is required",
            lowercase:true,
            trim:true
        },
        fullName:{
            type:String,
            required:"Full name is required",
            trim:true
            
        },
        logoLink:{
            type:String,
            required:"logolink is required",
        },
        isDeleted: {type: Boolean, default:false}
    },{timestamps: true}
)
module.exports = mongoose.model('college', collegeModel);