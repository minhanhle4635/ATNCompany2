const express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

//var url = 'mongodb://localhost:27017';
var url = 'mongodb+srv://minhanhle:minhanh123@cluster0-p2f69.gcp.mongodb.net/test?retryWrites=true&w=majority';

router.get('/',async (req,res)=>{
    if(!req.session.username)
  {
    return res.status(401).send();
  }
  else 
  {
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNCompany");
    let results = await dbo.collection("Employee").find({}).toArray();
    res.render('allNhanVien',{NhanVien:results});
  }
})

router.get('/edit', async(req,res)=>{
    if(!req.session.username)
  {
    return res.status(401).send();
  }
  else 
  {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;

    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNCompany");
    let result = await dbo.collection("Employee").findOne({"_id" : ObjectID(id)});
    res.render('editNhanVien',{NhanVien:result});
  }
})

router.post('/edit', async(req,res)=>{
    let id = req.body.id;
    let name = req.body.name;
    let sdt = req.body.phone;
    let address = req.body.adress;
    let status = req.body.status;
    let newValues ={$set : {EmployeeName: name, PhoneNumber : sdt, Adress: address, Status : status}};
    
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};
    
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNCompany");
    await dbo.collection("Employee").updateOne(condition,newValues);
    
    res.redirect('/sanpham');
})

router.get('/insert',(req,res)=>{
    if(!req.session.username)
  {
    return res.status(401).send();
  }
  else 
  {
    res.render('insertNhanVien');
  }
})

router.post('/insert',async (req,res)=>{
    let name = req.body.EmployeeName;
    let sdt = req.body.PhoneNumber;
    let address = req.body.Adress;
    let status = req.body.Status;
    let newE = {EmployeeName : name, PhoneNumber : sdt, Adress : address, Status : status};
    
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNCompany");
    await dbo.collection("Employee").insertOne(newE);
   
    let results = await dbo.collection("Employee").find({}).toArray();
    res.render('allNhanVien',{NhanVien:results});
})

router.get('/search',(req,res)=>{
    if(!req.session.username)
  {
    return res.status(401).send();
  }
  else 
  {
    res.render('searchNhanVien');
  }
})

router.post('/search',async (req,res)=>{
    let searchNV = req.body.EmployeeName;
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNCompany");
    let results = await dbo.collection("Employee").find({"EmployeeName":searchNV}).toArray();
    res.render('allNhanVien',{NhanVien:results});
})

module.exports = router;