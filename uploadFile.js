const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const multer = require('multer');
fs = require('fs-extra')
app.use(bodyParser.urlencoded({ extended: true }))
var router = express.Router();

const MongoClient = require('mongodb').MongoClient
ObjectId = require('mongodb').ObjectId

//const myurl = 'mongodb://localhost:27017';
const myurl = 'mongodb+srv://minhanhle:minhanh123@cluster0-p2f69.gcp.mongodb.net/test?retryWrites=true&w=majority';

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
})
  
var upload = multer({ storage: storage })

MongoClient.connect(myurl, (err, client) => {
    if (err) return console.log(err)
    db = client.db('test')
})

router.get('/', function (req, res) {
    res.sendFile(__dirname + '/upload.html');
  
  });

router.post('/uploadphoto', upload.single('picture'), (req, res) => {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    // Define a JSONobject for the image attributes for saving to database
    var finalImg = {
      contentType: req.file.mimetype,
      image: new Buffer(encode_image, 'base64')
    };
    db.collection('mycollection').insertOne(finalImg, (err, result) => {
        console.log(result)
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/upload/viewAllPhotos')
    })
})

router.get('/photos', (req, res) => {
    db.collection('mycollection').find().toArray((err, result) => {
  
      const imgArray = result.map(element => element._id);
      console.log(imgArray);
      if (err) return console.log(err)
      res.send(imgArray)
  
    })
});

router.get('/viewAllPhotos',async (req,res)=>{
    let client= await MongoClient.connect(myurl);
    let dbo = client.db("test");
    let results = await dbo.collection("mycollection").find({}).toArray();
    res.render('allPhoto',{photo:results});
});

router.get('/photo/:id', (req, res) => {
    var filename = req.params.id;
  
    db.collection('mycollection').findOne({ '_id': ObjectId(filename) }, (err, result) => {
      if (err) return console.log(err)
      res.contentType('image/jpeg');
      res.send(result.image.buffer)
      //res.render('viewImg',{img:result.image.buffer});
    })
  })

  router.get('/viewPhoto/:id', (req, res) => {
    var filename = req.params.id;
    res.render('viewImg',{img:filename}); 
  })

module.exports = router