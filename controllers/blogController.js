const { query } = require("express");
const { default: mongoose } = require("mongoose");
const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");
const ObjectId=mongoose.Types.ObjectId

const isValid=function(value){
  if(typeof value ==='undefined' || value===null)return false
  if(typeof value==='string' && value.trim().length===0)return false
  return true;
}
const isValidRequestBody=function(requestBody){
  return Object.keys(requestBody).length>0
}
const isValidObjectId=function(ObjectId){
  return mongoose.Types.ObjectId.isValid(ObjectId)
}
const createBlog = async (req, res) => {
  try {
    const requestBody=req.body;
    if(!isValidRequestBody(requestBody)){
      res.status(400).send({status:false,message:'invalid reqquest parameter.please provide blog details'})
      return
    }
    const {title,body,authorId,tags,category,subcategory,ispublished}=requestBody
    if(!isValid(title)){
      res.status(400).send({status:false,message:'title is required'})
      return
    }
    if(!isValid(body)){
      res.status(400).send({status:false,message:'body is required'})
      return
    }
    if(!isValid(authorId)){
      res.status(400).send({status:false,message:'author id is required'})
      return
    }
    if(!isValidObjectId(authorId)){
      res.status(400).send({status:false,message:`${authorId} is not a valid author id`})
      return

    }
    if(!isValid(category)){
      res.status(400).send({status:false,message:'blog category is required'})
      return
    }
    const author=await authorModel.findById(authorId)
    if(!author){
      res.status(400).send({status:false,message:'Author does not exit'})
      return
    }
    // validation end
    const blogData={
      title,
      body,
      authorId,
      category,
      ispublished:ispublished ? ispublished: false,
      publishedAt:ispublished ? new Date():null
    }
    if(tags){
      if(Array.isArray(tags)){
        blogData['tags']=[...tags]
      }
      if(Object.prototype.toString.call(tags)=== "[object String]"){
        blogData['tags']=[tags]
      }
    }
    if(subcategory){
      if(Array.isArray(subcategory)){
        blogData['subcategory']=[...subcategory]
      }
      if(Object.prototype.toString.call(subcategory)=== "[object String]"){
        blogData['subcategory']=[subcategory]
      }
    }
    const newBlog=await blogModel.create(blogData)
    res.status(201).send({status:true,message:'newblog created successfully',data:newBlog})


  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
};

const getBlogs = async (req, res) => {
  try {
    const filterQuery={isDeleted:false,deletedAt:null,ispublished:true}
    const queryParams=req.query
    if(isValidRequestBody(queryParams)){
      const{authorId,category,tags,subcategory}=queryParams
      if(isValid(authorId) && isValidObjectId(authorId)){
        filterQuery['authorId']=authorId
      }
      if(isValid(category)){
        filterQuery['category']=category.trim()
      }
      if(isValid(tags)){
        const tagsArr=tags.trim().split(',').map(tag=>tag.trim());
        filterQuery['tags']={$all:tagsArr}
      }
      if(isValid(subcategory)){
        const subcatArr=subcategory.trim().split(',').map(subcat=>subcat.trim());
        filterQuery['subcategory']={$all:subcatArr}
      }

    }
    const blogs=await blogModel.find(filterQuery)
    if(Array.isArray(blogs) && blogs.length===0){
      res.status(400).send({status:false,message:'no blogs found'})
      return

    }
    res.status(201).send({status:true,message:'blogs list',data:blogs})


  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
      
    const blogId = req.params.blogId;
    const data = req.body;
    if(Object.keys(data).length == 0){
        return res.status(400).send({status:false, msg:"Invalid Request"})
    }
    const deleteTrue = await blogModel.findById(blogId);
    if (deleteTrue.isDeleted) {
      return res.status(404).json({ status: false, msg: "ID not found!" });
    }

    const blog = await blogModel.findOneAndUpdate({ _id: blogId }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return res.status(404).json({ msg: `No blog with id: ${blogId}` });
    }
    res.status(200).json({ id: blogId, data: req.body });
  } catch (error) {
    res.status(500).json({ msg: "Error", Error: error.message });
  }
};

const deleteById = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const idCheck = await blogModel.findById(blogId);
    if (!idCheck) {
      return res.status(404).send({ status: false, msg: "Invalid blog ID!" });
    }
    const searchId = await blogModel.findByIdAndUpdate(blogId, {
      isDeleted: true,
      deletedAt: new Date(),
      new: true,
    });
    res.status(200).send({ status: true, msg: "ID deleted Successfully",data:searchId });
  } catch (error) {
    res.status(500).json({ msg: "Error", Error: error.message });
  }
};

const deleteByQuery = async (req, res) => {
    try {
        let blogs = await blogModel.find(req.query);
        //console.log(blogs);
        for(let i=0; i<blogs.length; i++){
            blogs[i].isDeleted = true;
        }
        blogs.save()
        //let changeBlog =  blogModel.updateMany(blogs,{isDeleted: true, new:true});
        
        res.status(200).json({status:true, msg:"Deleted Successfully!", data:blogs});
        
    } catch (error) {
        res.status(500).json({ msg: "Error", Error: error.message });
    }
}


module.exports = {
  createBlog,
  getBlogs,
  updateBlog,
  deleteById,
  deleteByQuery,
  
};
