let express = require('express');
let app = express();
let Auth = require('../auth/security');
let Friends = require('../models/friends');
var cors = require('cors');

app.use(express.json());
app.use(cors())
app.get('/friends',(req,res) =>{
    Friends.find()
        .then(result => res.send({friends:result}))
        .catch(err => res.send(err))
})

app.get('/user/friend', Auth.ensureToken, (req,res) =>{
    Friends.find()
    .or({recieverId: req.data.data, status: 'Confirm'}).populate({path: 'recieverId', select: 'firstName lastName gender password email, Image',})
    .or({senderId: req.data.data, status: 'Confirm'}).populate({path: 'senderId',select: 'firstName lastName gender password email, Image'})
    .then(resp => {
        // let requestSend = []
        // let reqRec=[]
        let friend = []
        resp.map(item => {
            if(item.senderId._id == req.data.data) {
                friend.push(item.recieverId)
            } else {
                friend.push(item.senderId)
            }
        })
        res.send({result: friend, success:true})
    }).catch(err => res.send(err))
})

app.get('/user/requestsent', Auth.ensureToken, (req,res) =>{
    Friends.find()
    .or({senderId: req.data.data}).populate({path: 'recieverId', select: 'firstName lastName  gender password email',})
    //.or({senderId: req.data.data}).populate({path: 'senderId',select: 'firstName lastName Image gender password email'})
    .then(resp => {
        // let requestSend = []
        // let reqRec=[]
        // let friend = []
        // resp.map(item => {
        //     if(item.status === 'Pending') {
        //         console.log(item.senderId._id == req.data.data, item.senderId._id, req.data.data)
        //         if(item.senderId._id == req.data.data) {
        //             requestSend.push(item.recieverId)
        //         } else {
        //             reqRec.push(item.senderId)
        //         }
        //     } else {
        //         if(item.senderId._id == req.data.data) {
        //             friend.push(item.recieverId)
        //         } else {
        //             friend.push(item.senderId)
        //         }
        //     }
        // })
        res.send({result: resp, success:true})
    }).catch(err => res.send(err))
})


app.get('/user/requestreceived', Auth.ensureToken, (req,res) =>{
    Friends.find()
    .or({recieverId: req.data.data}).populate({path: 'senderId', select: 'firstName lastName Image gender password email',})
    //.or({senderId: req.data.data}).populate({path: 'senderId',select: 'firstName lastName Image gender password email'})
    .then(resp => {
        // let requestSend = []
         let reqRec=[]
        // let friend = []
        resp.map(item => {
            reqRec.push(item.senderId)
                
        })
        res.send({result:reqRec, success:true})
    }).catch(err => res.send(err))
})





app.post('/friends/friend',Auth.ensureToken,(req,res) =>{
    let frnd = req.body
    console.log('frnd : ',frnd)
    let friendData = new Friends(frnd); 
    Friends.find()
    .or({ senderId: frnd.senderId, recieverId: frnd.recieverId })
    .or({ senderId:  frnd.recieverId , recieverId: frnd.senderId})
    .then(resp => {
        console.log(resp)
        if(resp.length === 0) {
            friendData.save()
            .then(result => res.send(result))
            .catch(err => res.send(err))
        } else {
            res.send({status: "Request Already Sent"})
        }
    }).catch(err => res.send(err))
})

app.delete('/friends',Auth.ensureToken,(req,res) =>{
       
    Friends.remove({status:'Confirm'})
    .then(result => res.send(result))
    .catch(err => res.send(err))
})

app.get('/getstatus/:friendId',Auth.ensureToken,(req,res) =>{
    Friends.findOne({ senderId: req.data.data, recieverId: req.params.friendId })
        .then(resp => {
            console.log(JSON.stringify(resp))
            if(resp != null) {
                if(resp.status !== "Confirm") {
                    res.send({status: 'Request Sent', key:"Confirm" ,senderId: req.data.data, recieverId: req.params.friendId})
                } else {
                        res.send({status: 'Friends', key:"remove" ,senderId: req.data.data, recieverId: req.params.friendId})
                    }
            }else {
                Friends.findOne({ senderId: req.params.friendId, recieverId: req.data.data  }).
                then(rest => {
                    console.log("2")
                    if(rest != null) {
                        if(rest.status === "Pending") {
                            res.send({status:"Confirm Request", key:"Confirm",senderId: req.params.friendId, recieverId: req.data.data})
                        }
                        else {
                            res.send({status: 'Friends', key:"remove" ,senderId: req.data.data, recieverId: req.params.friendId})
                        }
                    } else {
                        console.log("4")
                        res.send({status:'Add Friend', key:"Pending", senderId: req.data.data, recieverId: req.params.friendId})
                    }
                })
            }
        })      
})
module.exports = app;