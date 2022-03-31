const booksModel = require("../models/booksModel");
const reviewModel=require("../models/reviewModel");
const mongoose=require('mongoose')
const moment=require('moment')

const isValid=function(value){
    if(typeof value ==='undefined' || value===null)return false
    if(typeof value==='string' && value.trim().length===0)return false
    return true;
}
const isValidRequestBody=function(requestBody){
    return Object.keys(requestBody).length>0
}
const isValidRating=function(rating){
    if(rating<=5 && rating>=1){
        return true
    }
}
const isValidObjectId=function(ObjectId){
    return mongoose.Types.ObjectId.isValid(ObjectId)
  }

const addReview=async function(req,res){
    try{
        const requestBody=req.body
        if(!isValidRequestBody(requestBody)){
            res.status(400).send({status:false,message:"invalid reqquest parameter.please provide review details"})
            return
        }
        const params=req.params
        const bookId=params.bookId
        if(!isValidObjectId(bookId)){
            res.status(400).send({status:false,message:"this is not a valid object id"})
            return
        }

        const findBook=await booksModel.findOne({bookId:bookId,isDeleted:false})
        if(!findBook){
            res.status(404).send({status:false,message:'no books found'})
            return
        }
        const{reviewedAt,rating} = requestBody;
        if(!isValid(reviewedAt)){
            res.status(400).send({status:false,message:"review date is missing"})
            return
        }
        //adding mandatory reviewedAt field to review 
        if(!reviewedAt){
        reviewedAt = Date.now();
        }else if(!(reviewedAt.trim())){
        reviewedAt = Date.now();
        }else{
        let validity = moment(reviewedAt, "YYYY-MM-DD",true).isValid();
        if(!validity) return res.status(400).send({status:false,message:"input a valid date in YYYY-MM-DD format."})
        }

        //validating reviewedBy
        let {reviewedBy}= requestBody
        if(!reviewedBy){
        reviewedBy="Guest"
        }
        else{
        reviewedBy=reviewedBy.trim();
        if(!reviewedBy)  reviewedBy= "Guest"           
        requestBody.reviewedBy=reviewedBy;
        }

        // validating rating

        if(!isValid(rating)){
            res.status(400).send({status:false,message:"rating is missing"})
            return
        }
        if(!isValidRating(rating)){
            res.status(400).send({status:false,message:"please provide a rating between 1 to 5"})
            return
        }

        
        const updateBook=await booksModel.findOneAndUpdate({bookId:bookId},{$inc: { reviews: 1 }},{new:true})
        const reviewData=req.body
        const newReview=await reviewModel.create(reviewData)
        res.status(201).send({status:true,message:"review added succesfully",data:newReview})



    }catch (error) {
        res.status(500).json({status:false, error:error.message})
        
    }
   
}

const updateReview= async function(req,res){
    try{
        let params=req.params
        let bookId=params.bookId;
        let reviewId=params.reviewId

    //checks for valid bookId format
    if(!isValidObjectId(bookId)){
        res.status(400).send({status:false,message:"this is not a valid object id"})
        return
    }
    //checks for valid reviewId format
    if(!isValidObjectId(reviewId)){
        res.status(400).send({status:false,message:"this is not a valid object id"})
        return
    }
    //if no updations data is provided
    let details= req.body;
    if(!isValidRequestBody(details)){
        res.status(400).send({status:false,message:"please provide review details to update"})
        return
    }
    //checking wheather the book is exist or not
    const bookDetails=await booksModel.findOne({_id:bookId,isDeleted:false})
    if(!bookDetails) return res.status(404).send({status:false, message:'no such book exist'})

    //checking wheather the review is exist or not
    const reviewDetails=await reviewModel.findOne({_id:reviewId,isDeleted:false})
    if(!reviewDetails) return res.status(404).send({status:false, message:'no such review exist'})

    //checking if review exists for the same book
    if(reviewDetails.bookId!=bookId) return res.status(400).send({status:false, message:'Please make sure that review belongs to the bookId as in params'})
    

    let reviewData=req.body;
    if(!isValidRequestBody(reviewData)){
        res.status(400).send({status:false,message:"please provide review details to update"})
        return
    }

    let updationDetails= await reviewModel.findOneAndUpdate({_id:reviewId, isDeleted:false},details,{new:true})
    return res.status(201).send({status:true, message:'your data updated succesfully', data:updationDetails})
    }
    catch (error) {
        res.status(500).json({status:false, error:error.message})
        
    }
}

const deletereview=async function(req,res){
    try{
        let params=req.params
        let bookId=params.bookId;
        let reviewId=params.reviewId

    //checks for valid bookId format
    if(!isValidObjectId(bookId)){
        res.status(400).send({status:false,message:"this is not a valid object id"})
        return
    }
    //checks for valid reviewId format
    if(!isValidObjectId(reviewId)){
        res.status(400).send({status:false,message:"this is not a valid object id"})
        return
    }

    //checking wheather the book is exist or not
    const bookDetails=await booksModel.findOne({_id:bookId,isDeleted:false})
    if(!bookDetails) return res.status(404).send({status:false, message:'no such book exist'})

    //checking wheather the review is exist or not
    const reviewDetails=await reviewModel.findOne({_id:reviewId,isDeleted:false})
    if(!reviewDetails) return res.status(404).send({status:false, message:'no such review exist'})


    //decreasing review count for the book
    let review=await reviewModel.findOneAndUpdate({_id:reviewId,isDeleted:false},{isDeleted:true},{new:true})
    const deletereview=await booksModel.findOneAndUpdate({_id:bookId},{$inc: { reviews: -1 }},{new:true})

    return res.status(200).send({status:true, message:'Successfully deleted', data:review})


    }
    catch (error) {
        res.status(500).json({status:false, error:error.message})
        
    }
}

module.exports = {
    addReview,
    updateReview,
    deletereview
}