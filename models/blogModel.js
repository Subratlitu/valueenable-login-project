const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema(
    {
        title: {type: String, required:'title is required',trim:true},
        body: {type: String, required:'body is required',trim:true},
        authorId: {type:ObjectId,required:'blog author is required', refs: 'Author'},
        tags: [{type:String,trim:true}],
        category: {type:Array, required:'ctagory is required', trim:true},
        subcategory: [{type:String,trim:true}],
        createdAt: {type: Date,default: null},
        updatedAt: {type: Date,default: null},
        deletedAt: {type: Date, default: null},
        publishedAt: {type: Date, default: null},
        isPublished: {type: Boolean, default:false},
        isDeleted: {type: Boolean, default:false},



    },{timestamps:true}
)

module.exports = mongoose.model('Blog', blogSchema);