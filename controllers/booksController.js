const { status } = require("express/lib/response");
const userModel = require("../models/userModel");
const booksModel=require("../models/booksModel");
const jwt = require('jsonwebtoken');
const mongoose=require('mongoose')
const reviewModel = require("../models/reviewModel");
const moment=require('moment')


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
const createBooks=async function(req,res){
    try{
        const requestBody=req.body
        if(!isValidRequestBody(requestBody)){
            res.status(400).send({status:false,message:"invalid reqquest parameter.please provide books details"})
            return
        }
        //extraction of key value pairs by using destructring
        const{title,excerpt,userId,isbn,category,subCategory,releasedAt} = requestBody;

        if(!isValid(title)){
            res.status(400).send({status:false,message:"title is missing"})
            return
        }
      
        if(!isValid(excerpt)){
            res.status(400).send({status:false,message:"excerpt is missing"})
            return
        }

        if(!isValid(userId)){
            res.status(400).send({status:false,message:"user is is missing"})
            return
        }

        if(!isValidObjectId(userId)){
            res.status(400).send({status:false,message:`${userId} is not a valid user id`})
            return
      
          }
          let user= await userModel.findById(userId)
          if(!user) return res.status(404).send({status: false, message: "User doesn't exists"})
      
        if(!isValid(isbn)){
            res.status(400).send({status:false,message:"isbn is missing"})
            return
        }

        if(!isValid(category)){
            res.status(400).send({status:false,message:"category is missing"})
            return
        }

        if(!isValid(subCategory)){
            res.status(400).send({status:false,message:"sub category is missing"})
            return
        }
        if(subCategory.length==0) return res.status(400).send({status: false, message: "Please provide proper subcategory to create."})

        if(!isValid(releasedAt)){
            res.status(400).send({status:false,message:"released at field is missing"})
            return
        }
        // date validation
        let validity = moment(releasedAt, "YYYY-MM-DD",true).isValid();
        if(!validity) return res.status(400).send({status:false,message:"input a valid date in YYYY-MM-DD format."})


       // checking the uniqueness of title and isbn
        const isTitleAlreadyUsed= await booksModel.findOne({title:title})
        if(isTitleAlreadyUsed){
            res.status(400).send({status:false,message:`${title} title is already is used`})
            return
        }
        const isIsbnAlreadyUsed= await booksModel.findOne({isbn:isbn})
        if(isIsbnAlreadyUsed){
            res.status(400).send({status:false,message:`${isbn} isbn is already is used`})
            return
        }

        //validation end
        const bookData=req.body
        // creation of new book
        const newBook=await booksModel.create(bookData)
        res.status(201).send({status:true,message:"book created succesfully",data:newBook})


    }catch (error) {
        res.status(500).json({status:false, error:error.message})
        
    }
   
}
const getBooks = async (req, res) => {
    try {
      const filterQuery={isDeleted:false,deletedAt:null}
      const queryParams=req.query
      // adding filters to an object called filter query
      if(isValidRequestBody(queryParams)){
        const{userId,category,subCategory}=queryParams
        if(isValid(userId) && isValidObjectId(userId)){
          filterQuery['userId']=userId
        }
        if(isValid(category)){
          filterQuery['category']=category.trim()
        }
        if(isValid(subCategory)){
            filterQuery['subCategory']=subCategory.trim()
        }

      }
    // if there is filter to search
    if(filterQuery){
        const books=await booksModel.find(filterQuery).select({_id:1,title:1,excerpt:1,userId:1,category:1,releasedAt:1,reviews:1}).sort({title:1})
      if(Array.isArray(books) && books.length===0){
        res.status(400).send({status:false,message:'no books found'})
        return
      }
      res.status(201).send({status:true,message:'Books list',data:books})
  
    }
    // if there is no filter to search
    else{
        const books=await booksModel.find({isDeleted:false,deletedAt:null}).select({_id:1,title:1,excerpt:1,userId:1,category:1,releasedAt:1,reviews:1}).sort({title:1})
        if(Array.isArray(books) && books.length===0){
            res.status(400).send({status:false,message:'no books found'})
            return
          }
          res.status(201).send({status:true,message:'Books list',data:books})
    }
      
  
  
    } catch (error) {
      return res.status(500).json({ status: false, error: error.message });
    }
  };
  
const getBooksWithReview=async function(req,res){
    try{
        const params=req.params
        const bookId=params.bookId
        if(!isValidObjectId(bookId)){
            res.status(400).send({status:false,message:"this is not a valid object id"})
            return
        }
        //collecting book details
        let bookData=await booksModel.find({_id:bookId})
        if(!bookData){return res.status(400).send({status:false,message:"book is not exist"})}
        //collectiing all reviews
        let result=await reviewModel.find({bookId:bookId})
        //creating a new object and adding required key value pairs to it
        let obj={
            _id:bookData[0]._id,
            title:bookData[0].title,
            excerpt:bookData[0].excerpt,
            userId:bookData[0].userId,
            category:bookData[0].category,
            subCategory:bookData[0].subCategory,
            isDeleted:bookData[0].isDeleted,
            reviews:bookData[0].reviews,
            deletedAt:bookData[0].deletedAt,
            releasedAt:bookData[0].releasedAt,
            createdAt:bookData[0].createdAt,
            updatedAt:bookData[0].updatedAt,
            reviewsData:result
        }
        
        res.status(200).send({status:true,message:"book list",data:obj})
        


    }catch (error) {
        res.status(500).json({status:false, error:error.message})
    }
}


const updateBooksByBookId= async function(req,res)
{
try{
    let params=req.params
    let bookId=params.bookId;

    //checks for valid bookId format
    if(!isValidObjectId(bookId)){
        res.status(400).send({status:false,message:"this is not a valid object id"})
        return
    }
    //if no updations data is provided
    let details= req.body;
    if(!isValidRequestBody(details)){
        res.status(400).send({status:false,message:"please provide book details to update"})
        return
    }

    // checking if any value of key is empty or not
    let keys = Object.keys(details);
    for(let i=0; i<keys.length; i++){
        if(!(details[keys[i]])) return res.status(400).send({status:false, message:"Please provide proper details to update."})
    }
    //if user want to change the owner of the book
    // keys=Object.keys(details);
    // if(keys.includes("userId")){
    //     let userId = details.userId
    //     if(!isValidObjectId(userId)){
    //         res.status(400).send({status:false,message:"this is not a valid user id"})
    //         return
    //     }
    //     let user = await userModel.findOne({_id:userId});
    //     if(!user) return res.status(404).send({status: false, message: "user does not exist in our database."})
    // }

    
    //user cannot delete a book while updating it
    if(details.isDeleted==true)  return res.status(400).send({status:false, message:'You cannot delete book while updating'})
    
    //checking duplicity of title
    let title=details.title
    if(title!=undefined){
        let duplicateTitle= await booksModel.findOne({title});
        if(duplicateTitle) return res.status(400).send({status:false, message:'title already exists'})
    }   
    
    //checking duplicity of ISBN
    let ISBN=details.ISBN
    if(ISBN!=undefined){
        let duplicateISBN= await booksModel.findOne({ISBN});
        if(duplicateISBN) return res.status(400).send({status:false, message:'ISBN already exists'})
    }

    let book= await booksModel.findOne({_id:bookId, isDeleted:false})
    if(!book) return res.status(404).send({status:false, message:"No such book exists"})

    // if user want to update subcategory
    if(keys.includes("subCategory")){
        const array=details.subCategory;
        const prevSubcategory=book.subCategory;
        const newArray=prevSubcategory.concat(array)
        details.subCategory=newArray
        let updationDetails3= await booksModel.findOneAndUpdate({_id:bookId, isDeleted:false},details,{new:true})
        return res.status(200).send({status:true, message:'Success', data:updationDetails3})

        
    }
    //updating book after all validations
    let updationDetails= await booksModel.findOneAndUpdate({_id:bookId, isDeleted:false},details,{new:true})
    if(!updationDetails) return res.status(404).send({status:false, message:"No such book exists"})

    return res.status(200).send({status:true, message:'Success', data:updationDetails})

}catch(error){
    return res.status(500).send({status:false, Error: error.message})
}
}


const deleteBookByBookId=async function(req,res){
    try{
        let params=req.params
        let bookId=params.bookId;

    //checks for valid bookId format
    if(!isValidObjectId(bookId)){
        res.status(400).send({status:false,message:"this is not a valid object id"})
        return
    }
    let book=await booksModel.findOneAndUpdate({_id:bookId,isDeleted:false,deletedAt:null},{isDeleted:true,deletedAt:Date.now()},{new:true})
    if(!book) return res.status(404).send({status:false, message:"No such book exists"})
    return res.status(200).send({status:true, message:'Successfully deleted', data:book})
    }
    catch(error){
        return res.status(500).send({status:false, Error: error.message})
    }
    
}
  
module.exports = {
    createBooks,
    getBooks,
    getBooksWithReview,
    updateBooksByBookId,
    deleteBookByBookId
}