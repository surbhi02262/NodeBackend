let mongoose = require('mongoose');

let Schema = mongoose.Schema;
let topicSchema= new Schema({
    title:{type:String,required:true},
    description:String,
    category:{type:String,required:true},
    createdDate:String,
    createdBy:{type: Schema.Types.ObjectId, ref: 'User', required:true},
    lastUpdated:String
})
let Topic = mongoose.model('Topic', topicSchema)
module.exports = Topic