const express = require('express');
const router = express.Router();

const userController=require('../controllers/userController');
const booksController=require('../controllers/booksController');
const reviewController=require('../controllers/reviewController');

const middleware=require('../middlewares/auth')



///////

router.post('/register',userController.registerUser);
router.post('/login',userController.userLogIn)

///////
router.post('/books',middleware.authenticationUser,middleware.authorisationUser,booksController.createBooks)
router.get('/books',middleware.authenticationUser,middleware.authorisationUser,booksController.getBooks)
router.get('/books/:bookId',middleware.authenticationUser,middleware.authorisationUser,booksController.getBooksWithReview)
router.put('/books/:bookId',middleware.authenticationUser,middleware.authorisationUser,booksController.updateBooksByBookId)
router.delete('/books/:bookId',middleware.authenticationUser,middleware.authorisationUser,booksController.deleteBookByBookId)

////////
router.post('/books/:bookId/review',reviewController.addReview)
router.put('/books/:bookId/review/:reviewId',reviewController.updateReview)
router.delete('/books/:bookId/review/:reviewId',reviewController.deletereview)

////////


const aws = require("aws-sdk")
const removeUploadedFiles = require('multer/lib/remove-uploaded-files');



aws.config.update(
    {
        accessKeyId: "AKIAY3L35MCRVFM24Q7U",
        secretAccessKey: "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",
        region: "ap-south-1"
    }
)

let uploadFile =  (file) => {
    return  new Promise( function(resolve, reject) {
        //this function will upload file to aws and return the link
        let s3 = new aws.S3({ apiVersion: "2006-03-01" }) //we will be using s3 service of aws
        // uploadFile(files[0])
        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket", // HERE
            Key: "subrat/" + file.originalname, // HERE "/smiley.jpg"
            Body: file.buffer
        }

    s3.upload(uploadParams, function (err, data) {
            if (err) { 
                console.log(err);
                return reject({ "error": err }) 
            }

            //console.log(data)
            console.log(" file uploaded succesfully ")
            return resolve(data.Location) // HERE
    })

    // let data= await s3.upload(uploadParams)
    // if (data) return data.Location
    // else return "there is an error"

    }
    )
}

// AWS S3 Link Work
router.post("/write-file-aws", async function (req, res) {
    try {
        let files = req.files
        // console.log(files, files[0])
        if (files && files.length > 0) {
            //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
            let uploadedFileURL = await uploadFile(files[0])
            res.status(201).send({ msg: "file uploaded succesfully", data: uploadedFileURL })
        }
        else {
            res.status(400).send({ msg: "No file found" })
        }
    }
    catch (err) {
        res.status(500).send({ msg: err })
    }
}
)





module.exports = router;