let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let postSchema= new Schema({ 
    userId: {type: Schema.Types.ObjectId, ref:'User'},
    title:{type:String},
    message:{type:String},
    createdDate:String,
    image:{type:String},
    video:String
},{collection:'post'})
let Post = mongoose.model('Post',postSchema)
module.exports = Post