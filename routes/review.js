const express = require('express')
const router = express.Router({mergeParams:true})
const listing = require('../models/schema.js')
const wrapAsync = require('../utils/wrapasync.js')
const expressError = require('../utils/expresserror.js')
const  { reviewSchema }  = require('../sch.js')
const review = require('../models/review.js')
const {isLoggedIn , isAuthor} = require("../middleware.js")
const { destroyReview, postReview } = require('../controllers/review.js')

const validrev = (req,res,next)=>{
    let result = reviewSchema.validate(req.body);
    console.log(result);
    
    if(result.error){
      throw new expressError(400 , result.error);
    }
    else{
      next();
    }
  }

  
// delete review
router.delete("/:rev", isLoggedIn,isAuthor,wrapAsync(destroyReview) )
  
  // add review post
    router.post("/", isLoggedIn,validrev ,wrapAsync(postReview))


    module.exports = router