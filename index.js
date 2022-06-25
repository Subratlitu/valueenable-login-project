
const express = require('express');// used express as framework
const app = express();
const bodyParser = require('body-parser');// going to parse the body coming from user side
const route = require('./routes/route');
const { default: mongoose } = require('mongoose');// want to use mongo db as database so monggose





//some global middle ware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', route);



//connecting with mongodb
mongoose.connect("mongodb+srv://subrat1234:litu1234@cluster0.h1cfx.mongodb.net/valueenableDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

// server
app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});



