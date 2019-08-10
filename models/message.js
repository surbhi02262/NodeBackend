let mongoose = require('mongoose');

let Schema= mongoose.Schema;
let MessageSchema= new Schema({
    topicId:{type:Schema.Types.ObjectId,ref:'Topic',required:true},
    message:{type:String,required:true},
    userId: {type: Schema.Types.ObjectId, ref:'User',required:true},
    createdDate:{type : Number},
   vote:{type:Object}

},{collection:'message'})
let Message = mongoose.model('Message', MessageSchema)
module.exports = Message;

//db.message.insert([{topicId:"5d32b912bc90ff5659f5ac9f",message:"Understanding of Java",userId:"5d32ac1d57a0ad53f8275aa6",createdDate:"2018-08-1",vote:{like:260,dislike:1}}])



