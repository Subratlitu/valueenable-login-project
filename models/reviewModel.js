const mongoose=require('mongoose')
const objectId=mongoose.Schema.Types.ObjectId

const reviewModel=new mongoose.Schema(
    {
        bookId:{
            type:objectId,
            required:"book id is required",
            refs:'book'
        },
        reviewedBy:{
            type:String,
            default:'Guest',
            value:'reviewer name',
            required:true
        },
        reviewedAt:{
            type:Date,
            required:"reviewed at is required"
        },
        rating:{
            type:Number,
            required:"rating is required",
            min:1,
            max:5
        },
        review:{
            type:String
        },
        isDeleted:{
            type:Boolean,
            default:false
        },
        

    },{timestamps:true}
)
module.exports = mongoose.model('review', reviewModel);