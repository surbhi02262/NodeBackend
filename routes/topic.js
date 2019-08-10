var express = require('express');
let app =express();
let Auth = require('../auth/security');

let Topic = require('../models/topic');
app.use(express.json());


app.get('/topics',Auth.ensureToken,(req,res) =>{
    Topic.find().populate({path:'createdBy', select: 'firstName _id'}).exec()
    .then(function(data){
        res.status(200).send({result:data,success:true })
    })
    .catch(err => res.status(200).send({message:'No Data Found', success: false}))

})
app.post('/topics/topic',Auth.ensureToken,(req,res) => {
    let data = new Topic(req.body);
    console.log('req',req.body);
     console.log('data',JSON.stringify(data));
     data.save()
        .then(item =>res.send(item))
     .catch(err => res.send(err))
    //res.send(req.body)
})
app.get('/topics/topic/:id',Auth.ensureToken,(req,res) =>{
    Topic.findOne({ _id: req.params.id })
        .populate({path:'createdBy', select: 'firstName _id'})
        .exec()
        .then(resp => res.send(resp))
        
})
app.put('/topics/topic/:id',Auth.ensureToken,(req,res) =>{
    Topic.findOneAndUpdate({_id:req.params.id},req.body,{new:true},function(result,err) {
        if(err){res.status(500).send(err)}
        res.send(result);
    })
})
app.delete('/topics/topic/:id',Auth.ensureToken,(req,res) =>{
    Topic.remove({_id:req.params.id}).then(
            function(doc){
                if(doc.deletedCount !== 1){
                    res.status(404).send('topic not found')
                }
    
                Topic.find().then(function(doc){
                res.send({topics:doc})
                }).catch(err => console.log(err))
            }
        )     
    })


module.exports=app;