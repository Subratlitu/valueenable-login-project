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





module.exports = router;