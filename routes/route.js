const express = require('express');
const router = express.Router();

const collegeController=require('../controllers/collegeController')
const internController=require('../controllers/internController')


router.post('/functionup/colleges', collegeController.createCollege);
router.post('/functionup/interns', internController.createIntern);
router.get('/functionup/collegeDetails',internController.getInterns);


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjMwNmE2NzY2YjM2ZGE5M2I3Yzg1ZDgiLCJiYXRjaCI6InRob3JpdW0iLCJvcmdhbmlzYXRpb24iOiJGVW5jdGlvblVwIiwiaWF0IjoxNjQ3MzQwMTk3fQ.pGwLTI6CxEdYTHK6T486V5Oh3p-NVvv0N0z28nz-bXk


module.exports = router;