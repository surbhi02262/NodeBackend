let express= require('express');
let app = express();

let Auth = require('../auth/security');
let User = require('../models/user');


app.use(express.json());



app.get('/users',(req,res) =>{
    // let verify =  Auth.verifyToken(req)
    // if(verify) {
        //console.log('param',req);
        if(req.query.limit !== 'all'){
            User.find().limit(parseInt(req.query.limit))
            .then(function(doc){
                res.send({users:doc})
            })
            .catch(err =>  
                res.status(404).send('user not found')
            )
        }else{
            User.find().then(function(doc){
                res.send({users:doc})
            })
            .catch(err =>  
                res.status(404).send('user not found')
            )
        }
       
    // } else {
    //     res.status(200).send({error: 'ERROR: User not loged in', success: false })
    // }
    
})
app.get('/getUserInfo',Auth.ensureToken, (req,res) =>{
   // console.log("req.data : ",req.data)  
    User.find({_id:req.data.data}).then((user) =>{ 
       // console.log(user)  
        res.status(200).send({user: user[0], success: true});
    }).catch(err =>{
        res.status(200).send({message: 'User not found', success: false});
    })
})

app.get('/users/user/:id',Auth.ensureToken,(req,res) =>{
    User.find({_id:req.params.id})
    .then((result) =>{
        res.status(200).send({result, success:true});
    })
    .catch(err =>{
        res.status(404).send('user not found')
    })
})

app.post('/users/user',Auth.ensureToken,(req,res) =>{
    let userData = new User(req.body);
    userData.save()
    .then(data =>{
        res.status(200).send({result: data, success: true})
    })
    .catch(err =>{
        res.status(200).send({message:'data not saved Try agian', success: false})
    })
})

app.get('/login/:email/:password',(req,res) =>{

    User.find({email:req.params.email,password:req.params.password}).select({'password':0})
    .then((data) =>{
        if(data.length === 0) {
            res.status(200).send({message:'Invalid UserName or Password...',success:false})
        } else {
            let token = Auth.createToken(data[0]._id)
            res.status(200).send({result:{user:data[0]._id, token:token},success:true});
        }
    })
    .catch(err =>{
        res.status(200).send({message:'Invalid UserName or Password...',success:false})
    })
})

app.post('/signup',(req,res) =>{
    let userData = new User(req.body);
    userData.save()
    .then(data =>{

        res.send(data)
    })
    .catch(err =>{
        //console.log('err',err);
        res.status(500).send('data not saved Try agian')
    })
}) 

app.put('/users/user',Auth.ensureToken,(req,res,next)=>{
    User.findOneAndUpdate({_id:req.data.data},req.body,{new:true},(err,result)=> {
        if(err){
            res.status(404).send('user not found')
        }else{
    
            res.status(200).send({result:result,success:true});
        }
    })
})


app.put('/user/updateImage',Auth.ensureToken,(req,res,next)=>{
    User.findOneAndUpdate({_id:req.data.data},req.body,{new:true},(err,result)=> {
        if(err){
            res.status(404).send('user not found')
        }else{
    
            res.status(200).send({result:result,success:true});
        }
    })
})

app.delete('/users',(req,res)=>{
    User.remove({})
    .then(result =>{
        res.send(result)
    })
    .catch(err =>{
        res.status(400).send('user not able to delete')
    })
})

app.delete('/users/user/:id',Auth.ensureToken,(req,res)=>{
    User.remove({_id:req.params.id})
    .then(result =>{
        res.send(result)
    })
    .catch(err =>{
        res.status(400).send('user not able to delete')
    })
})
module.exports= app;