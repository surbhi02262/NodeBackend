let express = require('express');
let app = express();
let Message = require('../models/message');
let jwt = require('jsonwebtoken');

app.get('/messages',(req,res) =>{
    Message.find()
        .sort({'createdDate': 'desc'})
        .then(result => res.send({messages:result}))
        .catch(err => res.send(err))
})

app.get('/messages/topic/:topicId',(req,res) =>{
    Message.find({topicId:req.params.topicId})
    .sort({'createdDate': 'desc'})
    .populate({path: 'userId', select: 'firstName _id'})
        .exec()
        .then(result => res.send(result))
        .catch(err => res.send('message not found'))
})

app.get('/messages/message/:id',(req,res) =>{
    Message.find({_id:req.params.id})
    .populate({path: 'topicId userId'})
        .exec()
        .then(result => res.send(result))
        .catch(err => res.send('message not found'))
})
app.delete('/messages/message/:id',(req,res) =>{
    Message.remove({_id:req.params.id})
        .then(result => res.send(result))
        .catch(err => res.send(err))
})
app.put('/messages/message/:id',(req,res) =>{
    Message.findOneAndUpdate({_id:req.params.id},req.body,{new:true},function(result,err){
        if(err) {return res.status(500).send(err);}
        res.status(200).send(result)
    })
})
app.post('/messages/message',(req,res) =>{
    let msg = req.body
    msg.createdDate=new Date().getTime()
    let messageData = new Message(msg);
    
    messageData.save()
    .then(result => res.send(result))
    .catch(err => res.send(err))
})
module.exports = app;