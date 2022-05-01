const  util  = require('util');
const express = require('express');
const connection = require('../../db/connection');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const {findUserByEmail,insertUser}  = require('../../dao/userDao');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const auth = require('../../middlewares/auth');

const query = util.promisify(connection.query).bind(connection);
// Register A User
router.post("/", async(req,res)=>{
    try {
        console.log(req.body);
        const {email} = req.body;
        let user = await findUserByEmail(email);
        if(user){
            return res.status(400).json({"message" : "Email Id already exists"})
        }
        var salt = await bcrypt.genSaltSync(10);
        var passwsordHash = bcrypt.hashSync(req.body.password, salt);
        let insertQuery = await insertUser({
           uuid : uuidv4(),
           firstName : req.body.firstName,
           lastName : req.body.lastName,
           email : req.body.email,
           dob : req.body.dob,
           password : passwsordHash,
           type :'USER'
        })
        // Write Logic for email verification
        return res.status(200).send(insertQuery);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error");
    }
})

// Login API
router.post('/login',async(req,res)=>{
    try {
        let email = req.body.email;
        let password = req.body.password;
        let user = await findUserByEmail(email);
        console.log("user",user);
        if(!user){
            return res.status(401).send({"message" : "Invalid Credentials"})
        }
        let passwordMatch = await bcrypt.compareSync(password,user.password);
        if(!passwordMatch){
            return res.status(401).send({"message" : "Invalid Credentials"})
        }
        let token = await jwt.sign({
            userId : user.id,
            email : user.email,
        },'TodoAppKey',{expiresIn:'1h'});

        return res.status(200).send({token})

    } catch (error) {
        console.log(error);
        return res.status(500).send("Backend Server Crashed");
    }
});

router.get('/me',auth,async(req,res)=>{
    try {
        console.log(req.me);
        return res.status(200).send(req.me);
    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
})


module.exports = router;