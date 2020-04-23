const express = require('express');
var router = express.Router();

const app = express();
const multer = require('multer');
fs = require('fs-extra')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))
var MongoClient = require('mongodb').MongoClient;

//var url = 'mongodb://localhost:27017';
var url = 'mongodb+srv://minhanhle:minhanh123@cluster0-p2f69.gcp.mongodb.net/test?retryWrites=true&w=majority';

ObjectID = require('mongodb').MongoClient;
ObjectId = require('mongodb').ObjectId;

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
  
var upload = multer({ storage: storage })

router.get('/photos', async(req, res) => {
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNCompany");
    dbo.collection('Product').find().toArray((err, result) => {
  
      const imgArray = result.map(element => element._id);
      console.log(imgArray);
      if (err) return console.log(err)
      res.send(imgArray)
    })
});

router.get('/photo/:id', async(req, res) => {
    var filename = req.params.id;
  
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNCompany");
    dbo.collection('Product').findOne({'_id': ObjectId(filename)}, {Image : 1}, (err, result) => {
      if (err) return console.log(err)
      res.contentType('image'); 
      res.send(result.Image.image.buffer);
    })
  })

  router.get('/',async (req,res)=>{
    if(!req.session.username)
  {
    return res.status(401).send();
  }
  else 
  {
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNCompany");
    let results = await dbo.collection("Product").find({}).toArray();
    res.render('allSanPham',{sanPham:results});
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
    let result = await dbo.collection("Product").findOne({"_id" : ObjectID(id)});
    res.render('editSanPham',{sanPham:result});
  }
})

router.post('/edit', upload.single('picture'), async(req,res)=>{
    let id = req.body.id;
    let name = req.body.name;
    let origin = req.body.origin;
    let price = req.body.price;
    let status = req.body.status;

    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    var filename = req.params.id;

    var finalImg = {
      contentType: req.file.mimetype,
      image: new Buffer(encode_image, 'base64')
    };

    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};
    let newValues ={$set : {ProductName: name, Origin : origin, Price: price, Status: status, Image: finalImg}};
    
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNCompany");
    await dbo.collection("Product").updateOne(condition,newValues);
    
    res.redirect('/sanpham');
})


router.get('/insert',(req,res)=>{
    if(!req.session.username)
  {
    return res.status(401).send();
  }
  else 
  {
    res.render('insertProduct');
  }
})

router.post('/insert',upload.single('picture'),async (req,res)=>{
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNCompany");
    let name = req.body.ProductName;
    let origin = req.body.Origin;
    let price = req.body.Price;
    let status = req.body.Status;

    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');

    var finalImg = {
      contentType: req.file.mimetype,
      image: new Buffer(encode_image, 'base64')
    };

    let newProduct= {ProductName: name, Origin: origin, Price: price, Status:status, Image: finalImg};
    await dbo.collection("Product").insertOne(newProduct);
   
    let results = await dbo.collection("Product").find({}).toArray();
    res.redirect('/sanpham');
})

router.get('/search',(req,res)=>{
    if(!req.session.username)
  {
    return res.status(401).send();
  }
  else 
  {
    res.render('searchSanPham');
  }
})

router.post('/search',async (req,res)=>{
    let searchSP = req.body.ProductName;
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNCompany");
    let results = await dbo.collection("Product").find({"ProductName":searchSP}).toArray();
    res.render('allSanPham',{sanPham:results});
})

module.exports = router;