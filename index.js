const express = require('express');
const app = express();
var mongoose = require('mongoose');
var cors = require('cors');
app.use(cors())



//The pattern for the connection string is mongodb://<HOSTNAME>:<PORT>/<DBNAME>
mongoose.connect('mongodb://localhost:27017/node15july');
app.use('/uploads',express.static('uploads'));
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
let courseRoute = require('./routes/courses')
let userRoute = require('./routes/user');
let topicRoute=require('./routes/topic');
let messageRoute = require('./routes/message');
let friendRoute = require('./routes/friends');
let postRoute = require('./routes/posts');


app.use(courseRoute);
app.use(userRoute);
app.use(topicRoute);
app.use(messageRoute);
app.use(friendRoute);
app.use(postRoute);

const port = process.env.PORT || 3000;

app.listen(port,() =>{
    console.log(`listening on port ${port}`)
})


//db.users.insert([{firstName:"saurav",lastName:"verma",gender:"male",dob:'2018-06-13',contactNo:33333333,Image:"https://content-static.upwork.com/uploads/2014/10/02123010/profilephoto_goodcrop.jpg",email:"pankaj@gmail.com",password:"pankaj",userId:ObjectId(),nickName:"pankaj",nationality:"indian"}])
//db.topic.insert([{topicId:2,topicTitle:"Java",topicdescription:"Understanding of Java",topicCategory:'Java',createdDate:"2018-08-1",createdBy:2,lastUpdated:"2019-09-01"}])

