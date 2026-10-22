const express = require('express');
const router = express.Router();
const mysql = require('mysql2')
const util = require('util')


let conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:"",
    database:'alex'
})

let exe = util.promisify(conn.query).bind(conn);

router.get('/', async(req, res) => {
    let sql = 'select * from hero';
    let data = await exe(sql);
    res.render('website/index', { activePage: 'home',data:data[0] });
});

router.get('/about', async(req, res) => {
    let sql = 'select * from about';
    let data = await exe(sql)
    res.render('website/about', { activePage: 'about' ,about:data[0]});
});

router.get('/resume',async (req, res) => {
    let sql = 'select * from technical_skills';
    let data = await exe(sql);

    let sql_exp = 'select * from experience';
    let data_exp = await exe(sql_exp);

    let sql_edu = 'select * from education';
    let data_edu = await exe(sql_edu,);
   
    res.render('website/resume', { activePage: 'resume', ts:data, exp:data_exp, edu:data_edu });
});

router.get('/services', async (req, res) => {
    let sql = 'select * from service';
    let data = await exe(sql);
    res.render('website/services', { activePage: 'services' ,data});
});

router.get('/portfolio', async (req, res) => {
    let sql = 'select * from portfolio';
    let data = await exe(sql)
    res.render('website/portfolio', { activePage: 'portfolio', data });
});

router.get('/contact', async(req, res) => {
    let sql = 'select * from contact';
    let data = await exe(sql)
    res.render('website/contact', { activePage: 'contact', data:data[0] });
});

router.get('/blog', async(req, res) => {
    let sql = 'select * from blog';
    let data = await exe(sql);
    res.render('website/blog', { activePage: 'blog' , blog:data });
});

router.get('/testimonials', async(req,res)=>{
    let sql = 'select * from testimonial';
    let data = await exe(sql);
    res.render('website/testimonials', {activePage:'testimonials', data});
})

module.exports = router;