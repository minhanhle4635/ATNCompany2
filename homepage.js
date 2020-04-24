const express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

//var url = 'mongodb://localhost:27017';
var url = 'mongodb+srv://minhanhle:minhanh123@cluster0-p2f69.gcp.mongodb.net/test?retryWrites=true&w=majority';


router.get('/',(req,res)=>{
    if(!req.session.username)
    {
      return res.status(401).send();
    }
      res.render('homepage');
})

router.get('/logout', function (req, res) {
    req.session.username = null;
    res.redirect('/');
});

router.get('/signup',(req,res)=>{
    if(!req.session.username)
    {
      return res.status(401).send();
    } 
    else{
        res.render('signup');
    }
})

router.post('/signup',async(req,res)=>{
    let name = req.body.EmployeeName;
    let username = req.body.username;
    let password = req.body.Password;
    let newA = {EmployeeName : name, username : username, Password  : password};
    
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNCompany");
    dbo.collection("Account").insertOne(newA);
    res.render('homepage');
})


module.exports = router;