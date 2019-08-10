let jwt = require('jsonwebtoken');

module.exports = ({
    ensureToken : (req,res,next) => {
        const bearerHeader = req.headers["authorization"];
        if(typeof bearerHeader !== 'undefined'){
            const bearer = bearerHeader.split(" ");
            const bearerToken= bearer[1];
            req.token = bearerToken;
            jwt.verify(bearerToken,'my_secret_key',function(err,data){
                if(err){
                    res.status(200).send({message: "Unautheratzed User", success: false })
                } else {
                   req.data = data
                   next();
                }
            })
        }else{
            res.sendStatus(403);
        }
    },
    verifyToken: (req) => {
        //console.log(req.token)
        return jwt.verify(req.token,'my_secret_key',function(err,data){
            if(err){
                return false
            } else {
                return data
            }
        })
    },

    createToken: (data) => jwt.sign({data},'my_secret_key'),
    updateToken :  (req,res,next,result) => {
        const bearerHeader = req.headers["authorization"];
        if(typeof bearerHeader !== 'undefined'){
            const bearer = bearerHeader.split(" ");
            const bearerToken= bearer[1];
            req.token = bearerToken;
            jwt.verify(bearerToken,'my_secret_key',function(err,data){
                if(err){
                    res.status(200).send({message: "Unautheratzed User", success: false })
                } else {
                   req.data = result
                   next();
                }
            })
        }else{
            res.sendStatus(403);
        }
    },
        
})