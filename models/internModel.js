
const mongoose=require('mongoose');
const objectId=mongoose.Schema.Types.ObjectId


const internModel=new mongoose.Schema(
    {
        name:{
            type:String,
            
            required:"name is required",
            
            trim:true
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
        mobile:{
                type: String,
                unique:true,
                required:"mobile is required",
                match: /^([+]\d{2})?\d{10}$/
        },
        collegeId:{
            type:objectId,
            refs:'college',
            required:"this field is required"
        },
        isDeleted:{
            type:Boolean,
            default:false
        }
    },{timestamps: true}
)
module.exports = mongoose.model('intern', internModel);