if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}


const express = require('express')
const app = express()
const mongoose = require('mongoose');
const method = require("method-override");
const path = require('path')

const engine = require('ejs-mate')

const expressError = require('./utils/expresserror.js')

const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash')
const passport = require('passport')
const localStretegy = require('passport-local')
const user = require('./models/user.js')


const listingGet = require('./routes/listing.js')
const reviewGet = require('./routes/review.js')
const userGet = require('./routes/user.js')

app.engine('ejs', engine);

app.use(method("_method"));
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'/public')))

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

const link = process.env.MONGO_URL
mongoose.connect(link)
.then(() => console.log('Connected!'));
  

const store = MongoStore.create({
  mongoUrl:link,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter : 24*3600*1000,
})
store.on("error", ()=>{
  console.log("error in mongo session",err)
})

const sessionOption = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires : Date.now()+ 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly :true,
    },
  }
app.use(session(sessionOption))
  app.use(flash());

  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new localStretegy(user.authenticate()));
  passport.serializeUser(user.serializeUser());
  passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success"); 
  res.locals.error = req.flash("error"); 
  res.locals.currUser = req.user;
  next();
})

  app.use('/listing',listingGet)
  app.use('/listing/:id/reviews',reviewGet)
  app.use("/",userGet)




  app.all("*",(req,res,next)=>{
    next(new expressError(404,"Page not found"))
  })

  app.use((error,req,res,next)=>{
    let { statusCode=500 , message="something went wrong"}= error;
    res.status(statusCode).render("error.ejs",{message});
  })

  app.listen(3000, ()=>{
    console.log("connected")
  })
