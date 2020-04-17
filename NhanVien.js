const express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

//var url = 'mongodb://localhost:27017';
var url = 'mongodb+srv://minhanhle:minhanh123@cluster0-p2f69.gcp.mongodb.net/test?retryWrites=true&w=majority';

router.get('/',async (req,res)=>{
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNCompany");
    let results = await dbo.collection("Employee").find({}).toArray();
    res.render('allNhanVien',{NhanVien:results});
})

router.get('/edit', async(req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;

    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNCompany");
    let result = await dbo.collection("Employee").findOne({"_id" : ObjectID(id)});
    res.render('editNhanVien',{NhanVien:result});

})

router.post('/edit', async(req,res)=>{
    let id = req.body.id;
    let name = req.body.name;
    let sdt = req.body.phone;
    let address = req.body.adress;
    let newValues ={$set : {EmployeeName: name, PhoneNumber : sdt, Adress: address}};
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};
    
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNCompany");
    await dbo.collection("Employee").updateOne(condition,newValues);
    //
    let results = await dbo.collection("Employee").find({}).toArray();
    res.render('allNhanVien',{NhanVien:results});
})

//sanpham/insert->browser
router.get('/insert',(req,res)=>{
    res.render('insertNhanVien');
})

router.post('/insert',async (req,res)=>{
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNCompany");
    let name = req.body.EmployeeName;
    let sdt = req.body.PhoneNumber;
    let address = req.body.Adress;
    let newE = {EmployeeName : name,PhoneNumber : sdt , Adress : address};
    await dbo.collection("Employee").insertOne(newE);
   
    let results = await dbo.collection("Employee").find({}).toArray();
    res.render('allNhanVien',{NhanVien:results});
})

//sanpham/search->browser
router.get('/search',(req,res)=>{
    res.render('searchNhanVien');
})

//sanpham/search ->post
router.post('/search',async (req,res)=>{
    let searchSP = req.body.ProductName;
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNCompany");
    let results = await dbo.collection("Employee").find({"ProductName":searchSP}).toArray();
    res.render('allNhanVien',{NhanVien:results});
})

module.exports = router;