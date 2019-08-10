var mongoose = require('mongoose');

var Schema= mongoose.Schema;

var courseSchema= new Schema({
    id:{type:String,required:true},
    course:String,
},{collection:'courses'})

module.exports= mongoose.model('courseDataModel',courseSchema); 