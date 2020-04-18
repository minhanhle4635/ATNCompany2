const express = require('express');
var router = express.Router();

router.get('/',(req,res)=>{
    res.render('index');
})

router.get('/about',(req,res)=>{
    res.render('about',{ 
            name: "Bill Gates",
            job : "CEO"});
})

module.exports = router;