const express = require('express');
const { request } = require('http');
const router = express.Router();
const mysql = require('mysql2')
const util = require('util')
const session = require('express-session')
const fileUpload = require('express-fileupload')

let conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:"",
    database:'alex'
})
router.use(express.json())


router.use(session({
    secret:'a2z',
    resave:false,
    saveUninitialized:true
}))

router.use(fileUpload())
router.use(express.static('public'))


let fs = require('fs') // to remove files

let path = require('path');
const { text } = require('stream/consumers');


let exe = util.promisify(conn.query).bind(conn);
router.use(express.urlencoded({extended:true}));

function session_check(req,res,next){
    if(req.session.sid){
        next();
    }
    else{
         res.redirect('/admin/login')
    }
}

router.get('/',(req,res)=>{
    let username = req.session.email;
    res.render('admin/dashboard',{username:username})
})

router.get('/login',(req,res)=>{
    res.render('admin/login');
})

router.post('/login_check', async(req,res)=>{
    let {email,password} = req.body;
  
    let sql = 'select * from login where email=? and password=?';

    let data = await exe(sql,[email,password]);
    // res.send(data[0].id)
   
    if(data[0]){
       req.session.sid = data[0].id;
       req.session.email = data[0].email;
       res.redirect('/admin')
    }
    else{
        res.redirect('/login')
    }
 

})

router.get('/forgot',(req,res)=>{
    res.render('admin/forgot');
})
router.get('/logout',(req,res)=>{
    req.session.destroy();  // to destory the session 
    res.redirect('/admin/login');
})

// skill 

router.get('/skill_add',(req,res)=>{
    res.render('admin/skill_add')
})

router.post('/skill_add_save',async(req,res)=>{
   let {tech_name, tech_per} =req.body;

   let sql = 'insert into technical_skills(tech_name,tech_per) values(?,?)';
   let data = await exe(sql,[tech_name,tech_per]);
   res.redirect('/admin/skill_list')
})

router.get('/skill_list',async(req,res)=>{
    let sql = 'select * from technical_skills';
    let data = await exe(sql);
    res.render('admin/skill_list',{skill:data})
})

router.get('/skill_delete/:ts_id',async(req,res)=>{
    let id = req.params.ts_id;
    let sql = 'delete from technical_skills where ts_id =?';
    let data = await exe(sql,id);
      res.redirect('/admin/skill_list')
})

router.get('/skill_update/:tid', async (req, res) => {

    let id = req.params.tid;

    let sql = "SELECT * FROM technical_skills WHERE ts_id = ?";
    let data = await exe(sql, [id]);

    res.render('admin/skill_update', {
        skill: data[0]
    });

});


router.post('/skill_update_save', async (req, res) => {

    let { ts_id, tech_name, tech_per } = req.body;

    let sql = `
        UPDATE technical_skills
        SET
            tech_name = ?,
            tech_per = ?
        WHERE ts_id = ?
    `;

    await exe(sql, [tech_name, tech_per, ts_id]);

    res.redirect('/admin/skill_list');

});

// experience
   
router.get('/experience_add',(req,res)=>{
    res.render('admin/experience_add')
})

router.post('/experience_add_save',async(req,res)=>{
   let {exp_year, exp_position,exp_company,exp_desc} =req.body;

   let sql = 'insert into experience(exp_year, exp_position,exp_company,exp_desc) values(?,?,?,?)';
   let data = await exe(sql,[exp_year, exp_position,exp_company,exp_desc]);
   res.redirect('/admin/experience_list')
})

router.get('/experience_list',async(req,res)=>{
    let sql = 'select * from experience';
    let data = await exe(sql);
    res.render('admin/experience_list',{experience:data})
})

router.get('/experience_delete/:eid',async(req,res)=>{
    let id = req.params.eid;
    let sql = 'delete from experience where eid=?';
    let data = await exe(sql,id);
    res.redirect('/admin/experience_list')
})

router.get('/experience_update/:eid', async (req, res) => {

    let id = req.params.eid;

    let sql = "SELECT * FROM experience WHERE eid = ?";
    let data = await exe(sql, [id]);

    res.render('admin/experience_update', {
        experience: data[0]
    });

});

router.post('/experience_update_save', async (req, res) => {

    let { eid, exp_year, exp_position, exp_company, exp_desc } = req.body;

    let sql = `
        UPDATE experience
        SET
            exp_year = ?,
            exp_position = ?,
            exp_company = ?,
            exp_desc = ?
        WHERE eid = ?
    `;

    await exe(sql, [
        exp_year,
        exp_position,
        exp_company,
        exp_desc,
        eid
    ]);

    res.redirect('/admin/experience_list');

});

// education

   
router.get('/education_add',(req,res)=>{
    res.render('admin/education_add')
})

router.post('/education_add_save',async(req,res)=>{
   let {edu_year, edu_position,edu_company} =req.body;

   let sql = 'insert into education(edu_year, edu_position,edu_company) values(?,?,?)';
   let data = await exe(sql,[edu_year, edu_position,edu_company]);
   res.redirect('/admin/education_list')
})

router.get('/education_list',async(req,res)=>{
    let sql = 'select * from education';
    let data = await exe(sql);
    res.render('admin/education_list',{education:data})
})


router.get('/education_delete/:id',async(req,res)=>{
    let id = req.params.id;
    let sql = 'delete from education where eid =?';
    let data = await exe(sql,id);
   res.redirect('/admin/education_list')
})

router.get('/education_update/:eid', async (req, res) => {

    let id = req.params.eid;

    let sql = "SELECT * FROM education WHERE eid = ?";
    let data = await exe(sql, [id]);

    res.render('admin/education_update', {
        education: data[0]
    });

});

router.post('/education_update_save', async (req, res) => {

    let { eid, edu_year, edu_position, edu_company } = req.body;

    let sql = `
        UPDATE education
        SET
            edu_year = ?,
            edu_position = ?,
            edu_company = ?
        WHERE eid = ?
    `;

    await exe(sql, [
        edu_year,
        edu_position,
        edu_company,
        eid
    ]);

    res.redirect('/admin/education_list');

});

// services 

router.get('/service_add',(req,res)=>{
    res.render('admin/service_add')
})

router.post('/service_add_save',async(req,res)=>{
   let {service_icon,service_name,service_desc} =req.body;

   let sql = 'insert into service(service_icon,service_name,service_desc) values(?,?,?)';
   let data = await exe(sql,[service_icon,service_name,service_desc]);
   res.redirect('/admin/service_list')
})

router.get('/service_list',async(req,res)=>{
    let sql = 'select * from service';
    let data = await exe(sql);
    res.render('admin/service_list',{service:data})
})


router.get('/service_delete/:id',async(req,res)=>{
    let id = req.params.id;
    let sql = 'delete from service where sid =?';
    let data = await exe(sql,id);
   res.redirect('/admin/service_list')
})

router.get('/service_update/:sid', async (req, res) => {

    let id = req.params.sid;

    let sql = "SELECT * FROM service WHERE sid = ?";
    let data = await exe(sql, [id]);

    res.render('admin/service_update', {
        service: data[0]
    });

});

router.post('/service_update_save', async (req, res) => {

    let { sid, service_icon, service_name, service_desc } = req.body;

    let sql = `
        UPDATE service
        SET
            service_icon = ?,
            service_name = ?,
            service_desc = ?
        WHERE sid = ?
    `;

    await exe(sql, [
        service_icon,
        service_name,
        service_desc,
        sid
    ]);

    res.redirect('/admin/service_list');

});

// blog 

router.get('/blog_add',(req,res)=>{
    res.render('admin/blog_add')
})

router.post('/blog_add_save',async(req,res)=>{
   let {b_heading,b_desc,b_date} =req.body;
   let img = req.files.b_img;
    let imgName = Date.now() + img.name;
   
  let imgPath = path.join(__dirname, '..', 'public', imgName);

     img.mv(imgPath, async(err)=>{
        let sql = 'insert into blog(b_heading,b_desc,b_date,b_img) values(?,?,?,?)';
         let data = await exe(sql,[b_heading,b_desc,b_date,imgName]);
         res.redirect('/admin/blog_list')
        })
       
})

router.get('/blog_list',async(req,res)=>{
    let sql = 'select * from blog';
    let data = await exe(sql);
    res.render('admin/blog_list',{blog:data})
})

router.get('/blog_delete/:id',async(req,res)=>{
    let id = req.params.id;
    let sql = 'delete from blog where bid =?';
    let data = await exe(sql,id);
    res.redirect('/admin/blog_list')
})

router.get('/blog_update/:bid', async (req, res) => {

    let id = req.params.bid;

    let sql = "SELECT * FROM blog WHERE bid = ?";
    let data = await exe(sql, [id]);

    res.render('admin/blog_update', {
        blog: data[0]
    });

});

router.post('/blog_update_save', async (req, res) => {

    let { bid, b_heading, b_desc, b_date, old_img } = req.body;

    let imgName = old_img;

    if (req.files && req.files.b_img) {

        let img = req.files.b_img;
        imgName = Date.now() + img.name;

        let imgPath = path.join(__dirname, '..', 'public', imgName);

        await img.mv(imgPath);
    }

    let sql = `
        UPDATE blog
        SET
            b_heading = ?,
            b_desc = ?,
            b_date = ?,
            b_img = ?
        WHERE bid = ?
    `;

    await exe(sql, [
        b_heading,
        b_desc,
        b_date,
        imgName,
        bid
    ]);

    res.redirect('/admin/blog_list');

});

// testimonials

router.get('/testimonial_add',(req,res)=>{
    res.render('admin/testimonial_add')
})

router.post('/testimonial_add_save',async(req,res)=>{
   let {name,designation,company,description,rating} =req.body;
   let img = req.files.img;
    let imgName = Date.now() + img.name;
   
  let imgPath = path.join(__dirname, '..', 'public', imgName);

     img.mv(imgPath, async(err)=>{
        let sql = 'insert into testimonial(name,designation,company,description,rating,img) values(?,?,?,?,?,?)';
         let data = await exe(sql,[name,designation,company,description,rating,imgName]);
         res.redirect('/admin/testimonial_list')
        })
       
})

router.get('/testimonial_list',async(req,res)=>{
    let sql = 'select * from testimonial';
    let data = await exe(sql);
    res.render('admin/testimonial_list',{testimonial:data})
})


router.get('/testimonial_delete/:id',async(req,res)=>{
    let id = req.params.id;
    let sql = 'delete from testimonial where id =?';
    let data = await exe(sql,id);
   res.redirect('/admin/testimonial_list')
})

router.get('/testimonial_update/:id', async (req, res) => {

    let id = req.params.id;

    let sql = "SELECT * FROM testimonial WHERE id = ?";
    let data = await exe(sql, [id]);

    res.render('admin/testimonial_update', {
        testimonial: data[0]
    });

});

router.post('/testimonial_update_save', async (req, res) => {

    let { id, name, designation, company, description, rating, old_img } = req.body;

    let imgName = old_img;

    if (req.files && req.files.img) {

        let img = req.files.img;
        imgName = Date.now() + img.name;

        let imgPath = path.join(__dirname, '..', 'public', imgName);

        await img.mv(imgPath);
    }

    let sql = `
        UPDATE testimonial
        SET
            name = ?,
            designation = ?,
            company = ?,
            description = ?,
            rating = ?,
            img = ?
        WHERE id = ?
    `;

    await exe(sql, [
        name,
        designation,
        company,
        description,
        rating,
        imgName,
        id
    ]);

    res.redirect('/admin/testimonial_list');

});

// portfolio

router.get('/portfolio_add',(req,res)=>{
    res.render('admin/portfolio_add')
})

router.post('/portfolio_add_save',async(req,res)=>{
   let {p_name} =req.body;
   let img = req.files.p_img;
    let imgName = Date.now() + img.name;
   
  let imgPath = path.join(__dirname, '..', 'public', imgName);

     img.mv(imgPath, async(err)=>{
        let sql = 'insert into portfolio(p_name,img) values(?,?)';
         let data = await exe(sql,[p_name,imgName]);
         res.redirect('/admin/portfolio_list')
        })
       
})

router.get('/portfolio_list',async(req,res)=>{
    let sql = 'select * from portfolio';
    let data = await exe(sql);
    res.render('admin/portfolio_list',{portfolio:data})
})

router.get('/portfolio_delete/:id',async(req,res)=>{
    let id = req.params.id;
    let sql = 'delete from portfolio where pid =?';
    let data = await exe(sql,id);
   res.redirect('/admin/portfolio_list')
})

router.get('/portfolio_update/:pid', async (req, res) => {

    let id = req.params.pid;

    let sql = "SELECT * FROM portfolio WHERE pid = ?";
    let data = await exe(sql, [id]);

    res.render('admin/portfolio_update', {
        portfolio: data[0]
    });

});


router.post('/portfolio_update_save', async (req, res) => {

    let { pid, p_name, old_img } = req.body;

    let imgName = old_img;

    if (req.files && req.files.p_img) {

        let img = req.files.p_img;
        imgName = Date.now() + img.name;

        let imgPath = path.join(__dirname, '..', 'public', imgName);

        await img.mv(imgPath);
    }

    let sql = `
        UPDATE portfolio
        SET
            p_name = ?,
            img = ?
        WHERE pid = ?
    `;

    await exe(sql, [p_name, imgName, pid]);

    res.redirect('/admin/portfolio_list');

}); 

//settings

router.get('/settings', async(req,res)=>{
    
    let sql = 'select * from contact';
    let data = await exe(sql);

    // social data
    let sql1 = 'select * from social';
    let data1 = await exe(sql1);
  
    res.render('admin/settings',{data:data[0],social:data1[0]})
})


router.post('/contact_save', async(req,res)=>{
        let {email, phone, address,map,old_logo} = req.body;
        if(req.files){
            let img = req.files.logo;
            var imgName = Date.now() + img.name;
            let imgPath = path.join(__dirname,'..','public',imgName);
            img.mv(imgPath,(err)=>{})

            let imgPath1 = path.join(__dirname,'..','public',old_logo);
            fs.unlink(imgPath1,(err)=>{})
            
        }
        else{
           let imgName = old_logo;
        }

        let sql = 'update contact set email=?,phone=?,address=?,map=?,logo=? where cid=1';
        let data = await exe(sql,[email, phone, address, map,imgName]);
        res.redirect('/admin/settings')
})

router.post('/social_save', async(req,res)=>{
    let{ facebook, twitter,instagram,linkedin,github,youtube} = req.body;

    let sql = 'update social set facebook=?,twitter=?,instagram=?,linkedin=?,github=?,youtube=? where sid=1'
    let data = await exe(sql,[facebook, twitter,instagram,linkedin,github,youtube]);

    res.redirect('/admin/settings')  

})

router.get('/hero',async(req,res)=>{
    let sql = 'select * from hero';
    let data = await exe(sql)
    res.render('admin/hero',{hero:data[0]})
})

router.post('/hero_save',async(req,res)=>{
    let {name,designation,description,old_img} = req.body;

    if(req.files){
        let img = req.files.img;
        var imgName = Date.now() + img.name;
        var imgPath = path.join(__dirname,'..','public',imgName);
        
        img.mv(imgPath,(err)=>{})

        // to remove old img
        let imgPath1 = path.join(__dirname,'..','public',old_img)
        fs.unlink(imgPath1,(err)=>{})
        
    }
    else{
        var imgName = old_img;
    }

    let sql = 'update hero set name=?,designation=?,description=?, img = ? where hid = 1';
    let data = await exe(sql,[name,designation,description,imgName])
    res.redirect('/admin/hero')
})

router.get('/about', async(req,res)=>{

    let sql = 'select * from about';
    let data = await exe(sql);
    
    res.render('admin/about',{about:data[0]})

})

router.post('/about_save', async(req,res)=>{
    let {name,email,location,freelance, experience, position,description,old_img} = req.body;

    if(req.files){
        let img = req.files.img;
        var imgName =  Date.now() + img.name;

        var imgPath = path.join(__dirname,'..','public',imgName);
        img.mv(imgPath,(err)=>{})

        // remove old img
       let imgPath1 = path.join(__dirname,'..','public',old_img);
        fs.unlink(imgPath1,(err)=>{})

    }
    else{
        var imgName=old_img;
    }

   let sql = 'update about set name=?,email=?,location=?,freelance=?, experience=?, position=?,description=?,img=? where aid =1';
   let data =  await exe(sql,[name,email,location,freelance, experience, position,description,imgName]);

    res.redirect('/admin/about')

})

router.get('/enquiry', async(req,res)=>{
    let sql = 'select * from enquiry';
    let data = await exe(sql);
    res.render('admin/enquiry',{enquiry:data})
})

router.get('/enquiry_delete/:eid',async(req,res)=>{
    let id = req.params.eid;

    let sql = 'delete from enquiry where eid = ?';
    let data = await exe(sql,id);
    res.redirect('/admin/enquiry')
})

router.post('/enquiry_save', async(req,res)=>{
    let {name,email,subject,message} = req.body;

    let sql = 'insert into enquiry(name,email,subject,message)values(?,?,?,?)';
    let data = await exe(sql,[name,email,subject,message])
    res.redirect('/contact')
})

router.get('/contact',(req,res)=>{
    res.render('website/contact')
})

module.exports = router