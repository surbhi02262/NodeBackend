let mongoose = require('mongoose');

let Schema= mongoose.Schema;
let userSchema= new Schema({
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    gender:String,
    dob:Date,
    contactNo:{type:Number},
    Image:String,
    email:{type:String,required:true},
    password:{type:String,required:true},
    nickName:String,
    nationality:{type:String},
})
let User = mongoose.model('User',userSchema);
module.exports= User