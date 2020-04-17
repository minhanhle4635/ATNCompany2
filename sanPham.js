const express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017';
//var url = 'mongodb+srv://binhdq:abc@123@cluster0-lkrga.mongodb.net/test?retryWrites=true&w=majority';

router.get('/',async (req,res)=>{
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNCompany");
    let results = await dbo.collection("Product").find({}).toArray();
    res.render('allSanPham',{sanPham:results});
})

router.get('/edit', async(req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;

    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNCompany");
    let result = await dbo.collection("Product").findOne({"_id" : ObjectID(id)});
    res.render('editSanPham',{sanPham:result});

})
//update SP
router.post('/edit', async(req,res)=>{
    let id = req.body.id;
    let name = req.body.ProductName;
    let price = req.body.Price;
    let newValues ={$set : {ProductName: name,Price:price}};
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};
    
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNCompany");
    await dbo.collection("Product").updateOne(condition,newValues);
    //
    let results = await dbo.collection("Product").find({}).toArray();
    res.render('allSanPham',{sanPham:results});
})

//sanpham/insert->browser
router.get('/insert',(req,res)=>{
    res.render('insertProduct');
})
router.post('/insert',async (req,res)=>{
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNCompany");
    let name = req.body.ProductName;
    let color = req.body.Color;
    let gia = req.body.Price;
    let newSP = {ProductName : name,Color : color , Price : gia};
    await dbo.collection("Product").insertOne(newSP);
   
    let results = await dbo.collection("Product").find({}).toArray();
    res.render('allSanPham',{sanPham:results});
})

//sanpham/search->browser
router.get('/search',(req,res)=>{
    res.render('searchSanPham');
})

//sanpham/search ->post
router.post('/search',async (req,res)=>{
    let searchSP = req.body.ProductName;
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNCompany");
    let results = await dbo.collection("Product").find({"ProductName":searchSP}).toArray();
    res.render('allSanPham',{sanPham:results});
})

module.exports = router;