const http=require('http');
const bodyparser=require('body-parser');
const express=require('express');
const path=require("path");
const mongoose=require('mongoose');
const session=require('express-session');
const MongoDbStore=require('connect-mongodb-session')(session);
const csrf=require('csurf');
const flash=require('connect-flash');
const multer=require('multer');

const MONGODB_URI='mongodb+srv://ts12191234:Tanscloud@cluster0.m9h5wp3.mongodb.net/shop';

const app=express(); 
const store=new MongoDbStore({
    uri: MONGODB_URI,
    collection:'sessions'
})
const errorcontroller=require('./controllers/error');
const User=require('./models/user');
const Product=require('./models/product');

const csrfProtection=csrf();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));//here template folder name is views only so no need of it but in case if its something else then need to be specified like this

const adminroutes=require('./routes/admin');
const shoproutes=require('./routes/shop');
const authRoutes=require('./routes/auth');

const fileStorage=multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'images');
  },
  filename:function(req,file,cb){
    cb(null,new Date().toISOString().replace(/:/g,'-')+'-'+file.originalname);
  }
})
const fileFilter=(req,file,cb)=>{
  if(file.mimetype==='image/png'||file.mimetype==='image/jpg'||file.mimetype==='image/jpeg')
    {
      cb(null,true);
    }
  else{
    cb(null,false);
  }
};
app.use(bodyparser.urlencoded({extended: false}));
app.use(multer({storage:fileStorage, fileFilter:fileFilter}).single('image'));
app.use(express.static(path.join(__dirname,'public')));
app.use('/images', express.static(path.join(__dirname,'images')));
app.use(session({secret:'my secret',resave:false, saveUninitialized:false,store: store}));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  });

app.use((req,res,next)=>{
    res.locals.isAuthenticated=req.session.isLoggedIn;
    res.locals.csrfToken=req.csrfToken();
    next();
})

app.use(adminroutes);
app.use(shoproutes);
app.use(authRoutes);


app.use(errorcontroller.get404);
mongoose.connect('mongodb+srv://ts12191234:Tanscloud@cluster0.m9h5wp3.mongodb.net/shop')
 .then(result=>{
    console.log('connected');
    app.listen(3000);
})
.catch(err=>{
    console.log(err);
})
//sk-proj-jT0SbACmCoOf2eBv0U4JT3BlbkFJX5gksk3cR4aGe2Hlumqz
