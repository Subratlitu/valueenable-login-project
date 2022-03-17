const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const blogController = require('../controllers/blogController');
const middleware = require('../middlewares/auth')

router.post('/author', authorController.createAuthor);

router.post('/blog', blogController.createBlog);

router.get('/blogs',blogController.getBlogs);

router.put('/blogs/:blogId', middleware.auth ,blogController.updateBlog);

router.delete('/blogs/:blogId',middleware.auth, blogController.deleteById);

router.delete('/delete/:blogId',middleware.auth, blogController.deleteByQuery);

router.post('/login', authorController.authorLogIn);



//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjMwNmE2NzY2YjM2ZGE5M2I3Yzg1ZDgiLCJiYXRjaCI6InRob3JpdW0iLCJvcmdhbmlzYXRpb24iOiJGVW5jdGlvblVwIiwiaWF0IjoxNjQ3MzQwMTk3fQ.pGwLTI6CxEdYTHK6T486V5Oh3p-NVvv0N0z28nz-bXk


module.exports = router;