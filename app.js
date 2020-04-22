const express = require('express');
const engines = require('consolidate');
const app = express();

var cookieParser = require('cookie-parser');
var session = require('express-session');

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

app.use(cookieParser());
app.use(session({secret: "ok",
                saveUninitialized:false, 
                resave: false
}));

//npm i handlebars consolidate --save
app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');


var indexController = require('./index.js');
var sanPhamController = require('./sanPham.js');
var employeeController = require('./NhanVien.js');
var managerController = require('./homepage.js')


app.use(express.static('public'));

app.use('/',indexController);
app.use('/index',indexController);
app.use('/sanpham',sanPhamController);
app.use('/nhanvien',employeeController);
app.use('/homepage',managerController);


app.listen(process.env.PORT || 3000);
