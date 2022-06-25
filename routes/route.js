const express = require('express');
const router = express.Router();// router function

const userController=require('../controllers/userController');// impoting user controller



///////

router.post('/register',userController.registerUser);// setting routes
router.get('/login',userController.userLogIn)





module.exports = router;// exporting this file