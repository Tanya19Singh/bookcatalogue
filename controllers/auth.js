const User=require('../models/user');
const nodemailer=require('nodemailer');
const bcrypt=require('bcryptjs');
require ('dotenv').config();
const notifier=require('node-notifier');
exports.getLogin=(req,res,next)=>{
    // const isLoggedIn=req.get('Cookie')[0].trim().split('=')[1]=='true';//not recommended as cookie value can be altered by anyone at  client side
    
            
            res.render('auth/login',{
                doctitle: 'login',
                path:'/login',
                //  activeshop:true, 
                //  productsCSS:true,
                // errorMessage: req.flash('error')
                });

       
}
exports.getSignup=(req,res,next)=>{
    // const isLoggedIn=req.get('Cookie')[0].trim().split('=')[1]=='true';//not recommended as cookie value can be altered by anyone at  client side
    
    
            res.render('auth/signup',{
                doctitle: 'signup',
                path:'/signup',
                 activeshop:true, 
                 productsCSS:true,
                });

       
}
exports.postSignup=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    const confirmPassword=req.body.confirmPassword;
    User.findOne({email:email})
    .then(userDoc=>{
        if(userDoc){

            return res.redirect('/signup');
        }
        return bcrypt.hash(password,12)
            .then(hashedPassword=>{
                const user=new User({
                    email:email,
                    password:hashedPassword,
                    cart:{items:[]}
                })
                return user.save();
            });
    })
    .then(()=>{
        return res.redirect('/login');
    })
    .catch(err=>{
        console.log(err);
    })
}
exports.postLogin=(req,res,next)=>{
    
    const email=req.body.email;
    const password=req.body.password;
    User.findOne({email:email})
    .then(user=>{
        if(!user){
            return res.json({error:'invalid email or password'})
        }
        bcrypt
        .compare(password,user.password)
        .then(doMatch=>{
            if(doMatch){
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(err => {
                    console.log(err);
                    res.redirect('/');
                });
            }
            res.redirect('/login');
        })
        .catch(err=>{
            console.log(err);
        })

    })
       
}
exports.postLogout=(req,res,next)=>{
req.session.destroy(err=>{
    if(err){
        console.log(err);
    }
    else{
        res.redirect('/');
        
    }
});
       
}
