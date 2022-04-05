const mongoose=require('mongoose')
const { stringify } = require('nodemon/lib/utils');
const objectId=mongoose.Schema.Types.ObjectId

const booksModel=new mongoose.Schema(
    {
        title:{
            type:String,
            required:"title is required",
            unique:true
        },
        excerpt:{
            type:String,
            required:"excerpt is required"
        },
        userId:{
            type:objectId,
            required:"object id is required",
            refs:'user'
        },
        isbn:{
            type:String,
            required:"ISBN is required",
            unique:true
        },
        category:{
            type:String,
            required:"category is required"
        },
        subCategory:{
            type:Array,
            required:"sub category is required"
        },
        reviews:{
            type:Number,
            default:0
        },
        bookCover: {type:String, required:true, trim:true},
        deletedAt:{
            type:Date,
            default:null
        },
        isDeleted:{
            type:Boolean,
            default:false
        },
        releasedAt:{
            type:Date,
            required:"released at field is required",
            format: "YYYY-MM-DD"
        }

    },{timestamps:true}
)
module.exports = mongoose.model('book', booksModel);