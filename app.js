const express = require('express');
const engines = require('consolidate');
const app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

//npm i handlebars consolidate --save
app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');


var indexController = require('./index.js');
var sanPhamController = require('./sanPham.js');
var uploadFileController= require('./uploadFile.js');
var employeeController = require('./NhanVien.js');

app.use(express.static('public'));
app.use('/index',indexController);
app.use('/sanpham',sanPhamController);
app.use('/upload',uploadFileController);
app.use('/nhanvien',employeeController);


var server=app.listen(3000,function() {});