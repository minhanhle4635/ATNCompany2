const express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

//var url = 'mongodb://localhost:27017';
var url = 'mongodb+srv://minhanhle:minhanh123@cluster0-p2f69.gcp.mongodb.net/test?retryWrites=true&w=majority';

router.get('/',(req,res)=>{
    req.session.username = null;
    res.render('index');
})

router.post('/homepage', async(req,res)=>{
    var username = req.body.username;
    var password = req.body.password;

    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNCompany");
    let result = await dbo.collection("Account").find({"username" : username , "Password" : password}).toArray();
    if (result == 0){
        res.redirect('/');
    }else{
        req.session.username = username; 
        res.redirect("/homepage");
    }
})

router.get('/about',(req,res)=>{
    res.render('about');
})

module.exports = router;