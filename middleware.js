const listing = require('./models/schema.js')
const review = require('./models/review.js')
const expressError = require('./utils/expresserror.js')
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        
        req.flash("error", "User must be logged in")
        return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl =(req,res,next)=>{
   
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id} = req.params;
    let listings = await listing.findById(id);
    if(!listings.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","permission not allowed")
        return res.redirect(`/listing/${id}`)
    }
    next();
}
module.exports.isAuthor=async(req,res,next)=>{
    let {id ,rev} = req.params;
    let reviews = await review.findById(rev);
    if(!reviews.author._id.equals(res.locals.currUser._id)){
        req.flash("error","permission not allowed")
        return res.redirect(`/listing/${id}`)
    }
    next();
}

module.exports.valid = (req,res,next)=>{
    console.log(req.body)
      let result = listingSchema.validate(req.body);
      console.log(result.error.details);
      
      if(result.error){
        throw new expressError(400 , result.error);
      }
      else{
        next();
      }
    }