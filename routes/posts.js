var express = require('express');
let app = express();
let Post = require('../models/posts');
let Auth = require('../auth/security');
let multer = require('multer');
app.use(express.json());

const storage = multer.diskStorage({
    destination : (req,file,cb) =>{
        cb(null,'./uploads/')
    },
    filename:  (req,file,cb) =>{
        cb(null, new Date().toISOString() + file.originalname);
    }
})
const fileFilter = (req,file,cb) =>{
    if(file.mimetype === 'image/jpeg'){
        cb(null,true)
    }else{
        cb(new Error('format not supported'),false)
    } 
} 
const upload = multer({
    storage:storage,
    limits:{
        fileSize : 1024 * 1024 *3
    },
    fileFilter:fileFilter,
});


app.get('/posts',(req,res) =>{
    Post.find()
    .sort({'createdDate': 'desc'})
    .populate({path: 'userId', select: 'firstName lastName _id Image'})

    .then(result => res.send({posts:result}))
    .catch(err => res.send(err))
})
app.get('/posts/postId',Auth.ensureToken,(req,res) =>{
    Post.find({postId:req.data.data})
    .sort({'createdDate': 'desc'})
    .populate({path: 'userId', select: 'firstName _id'})
        .exec()
        .then(result => res.send(result))
        .catch(err => res.send('message not found'))
})
app.get('/posts/:postId',(req,res) =>{
    Post.find({_id:req.params.postId})
    .populate({path: 'userId'})
        .exec()
        .then(result => res.send(result))
        .catch(err => res.send('message not found'))
})
app.put('/posts/:postId',(req,res) =>{
    Post.findOneAndUpdate({_id:req.params.postId},
            req.body,{new:true},function(result,err){
        if(err) {return res.status(500).send(err);}
        res.status(200).send(result)
    })
})

app.post('/post/image',upload.single('image'),Auth.ensureToken,(req,res) =>{
    console.log('re',req.body);
    let post = req.body
    post.userId= req.data.data;
    post.createdDate= new Date().toLocaleString()
    post.image= req.file.path;
    console.log('post',post);
    let data = new Post(post);
        data.save()
        .then(item =>res.send(item))
     .catch(err => res.send(err))
})

app.post('/post',Auth.ensureToken,(req,res) =>{
    console.log('re',req.body);
    let post = req.body
    post.userId= req.data.data;
    post.createdDate= new Date().toLocaleString()
    console.log('post',post);
    let data = new Post(post);
        data.save()
        .then(item =>res.send(item))
     .catch(err => res.send(err))
})

app.delete('/post/:postId',(req,res) =>{
    Post.remove({_id: req.params.postId})
        .then(result => res.send(result))
        .catch(err => res.send(err))
}) 
app.delete('/posts',(req,res) =>{
    Post.remove({})
        .then(result => res.send(result))
        .catch(err => res.send(err))
}) 

module.exports= app;