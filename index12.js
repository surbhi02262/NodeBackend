const express = require('express');
const app = express();
var mongoose = require('mongoose');
const Joi = require('joi');
var bodyParser = require('body-parser');

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//The pattern for the connection string is mongodb://<HOSTNAME>:<PORT>/<DBNAME>
mongoose.connect('mongodb://localhost:27017/node15july');

var Schema= mongoose.Schema;

var courseSchema= new Schema({
    id:{type:String,required:true},
    course:String,
},{collection:'courses'})

var courseDataModel = mongoose.model('courseDataModel',courseSchema); 

app.get('/',(req,res) =>{
    debugger;
    courseDataModel.find().then(function(doc){
    res.send({courses:doc})
    }).catch(err => console.log(err))
    })
    
    app.get('/api/courses',(req,res) =>{
       courseDataModel.find().then(function(doc){
        res.send({courses:doc})
        }).catch(err => console.log(err))
    })
    
    app.get('/api/courses/:id',(req,res) =>{
        courseDataModel.find({id:req.params.id}).then(function(doc){
        console.log('f',doc);
        if(doc.length === 0 ){
           return  res.status(404).send('course not found');
        }
            res.send(doc)
       }).catch(err => console.log(err))
     
    //    let filteredData = courses.filter(c => c.id === req.params.id);
    //    if(filteredData.length === 0){
    //        res.status(404).send('course not found')
    //    }
    //    res.send(filteredData);
    })
    app.get('/api/getmonth/:year/:month',(req,res)=>{
        res.send(req.query)
    })
    
    
    app.post('/api/courses',(req,res) =>{
        // const schema= {
        //     name:Joi.string().min(3).required()
        // };
        // const result = Joi.validate(req.body,schema);
        // console.log('res',result);
        // // if(!req.body.name || req.body.name.length < 3){
        //     if(result.error){
        //     res.status(400).send(result.error.details[0].message);
        //     return ;
        // }
        // const course = {
        //     id:courses.length + 1,
        //     name:req.body.name
        // };
        // courses.push(course);
        // res.send(courses);
    
         const schema= {
            course:Joi.string().min(3).required(),
            id:Joi.string().required()
        };
        const result = Joi.validate(req.body,schema);
        if(result.error){
          return res.status(404).send(result.error.details[0].message); 
        }
    
        var myData = new courseDataModel(req.body);
        myData.save()
        .then(item => {
        res.send(item);
        })
        .catch(err => {
        res.status(400).send("unable to save to database");
        });
    
    })
    
    app.put('/api/courses/:id',(req,res) =>{
    //     const course = courses.find(c => c.id === req.params.id);
    //     if(!course) res.send('course id not available')
    
    //    const result = validateCourse(req.body);
    //     if(result.error){
    //         res.status(400).send(result.error.details[0].message);
    //         return;
    //     }
    
    //     course.name = req.body.name;
    //     res.send(course);
           courseDataModel.findOneAndUpdate({id:req.body.id},req.body,{new:true},function(err,docs){
               console.log('res',docs);
               if (err) {return res.status(500).send(err);}
                res.send(docs);
           })
    
    })
    
    app.delete('/api/delete/:id',(req,res) =>{
    //    let course =  courses.find(c => c.id === req.params.id)
    //    if(!course) res.status(404).send('course not found ')
      // const index = courses.indexOf(course);
        // courses.splice(index,1);
        // res.send(course);
        courseDataModel.remove({id:req.params.id}).then(
            function(doc){
                if(doc.deletedCount !== 1){
                    res.status(404).send('course not found')
                }
    
                courseDataModel.find().then(function(doc){
                res.send({courses:doc})
                }).catch(err => console.log(err))
            }
        )
    
      
    })
    function validateCourse(course){
        const schema= {
            name:Joi.string().min(3).required()
        };
        return Joi.validate(course,schema)
    }


const port = process.env.PORT || 3000;

app.listen(port,() =>{
    console.log(`listening on port ${port}`)
})

