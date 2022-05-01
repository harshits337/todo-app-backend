const jwt = require('jsonwebtoken');

const auth  = (req,res,next)=>{
    const token = req.headers['authorization'];
    console.log(token);
    if(token === undefined){
        return res.status(401).send("Invalid Credentials");
    }
    jwt.verify(token,'TodoAppKey',(err,data)=>{
        if(err){
            console.log(err);
            return res.status(403).send("Something went wrong");
        }
        console.log(data);
        req['me'] = data;
        next();
    })
}

module.exports = auth;
