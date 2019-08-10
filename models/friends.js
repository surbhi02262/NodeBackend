let mongoose = require('mongoose');

let Schema= mongoose.Schema;
let FriendsSchema= new Schema({
    senderId:{type: Schema.Types.ObjectId, ref:'User',required:true, },
    recieverId: {type: Schema.Types.ObjectId, ref:'User',required:true, },
    status:{type:String, required:true},
},{collection:'friends'})
let Friends = mongoose.model('Friends', FriendsSchema)
module.exports = Friends;

//db.message.insert([{topicId:"5d32b912bc90ff5659f5ac9f",message:"Understanding of Java",userId:"5d32ac1d57a0ad53f8275aa6",createdDate:"2018-08-1",vote:{like:260,dislike:1}}])



