const { query } = require("express");
const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");


const createBlog = async (req, res) => {
  try {
    if (Object.keys(req.body).length != 0) {
      let aId = req.body.authorId;
      let author = await authorModel.findById(aId);
      if (!author) {
        return res.status(404).send("Invalid Author ID!");
      }

      let blog = await blogModel.create(req.body);
      return res.status(201).json({ status: true, data: blog });
    } else {
      return res.status(400).json({ status: false, msg: "Bad Request!" });
    }
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
};

const getBlogs = async (req, res) => {
  try {
    
    let blogs = await blogModel.find(req.query);
    
    res.status(201).send({ status: true, data: blogs });
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
      return res.status(404).send({ status: false, msg: "Invalid Author ID!" });
    }
    const searchId = await blogModel.findByIdAndUpdate(blogId, {
      isDeleted: true,
      deletedAt: new Date(),
      new: true,
    });
    res.status(200).send({ status: true, msg: "ID deleted Successfully" });
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
