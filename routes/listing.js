const express = require('express')
const router = express.Router({mergeParams:true})
const  { listingSchema }  = require('../sch.js')
const listing = require('../models/schema.js')
const wrapAsync = require('../utils/wrapasync.js')
const expressError = require('../utils/expresserror.js')
const {isLoggedIn , isOwner} = require("../middleware.js")
const { destroyListing, getEdit , putEdit, detailListing ,listingData} = require('../controllers/listing.js')
const { addListing, postListing } = require('../controllers/listing.js')
const multer  = require('multer')
const { cloudinary,storage} = require("../cloudConfig.js")
const upload = multer({ storage })


const valid = (req,res,next)=>{
  console.log(req.body)
    let result = listingSchema.validate(req.body);

    
    if(result.error){
      throw new expressError(400 , result.error);
    }
    else{
      next();
    }
  }

router.delete('/:id',isLoggedIn, isOwner, wrapAsync(destroyListing))

  //edit
  router.get('/:id/edit' , isLoggedIn, isOwner,wrapAsync(getEdit ))

  router.put('/:id',isLoggedIn ,upload.single('listing[image]'),valid,wrapAsync(putEdit))

  //create
  router.get('/new',isLoggedIn ,addListing )

  router.post('/',isLoggedIn, upload.single('listing[image]'),
  valid,wrapAsync(postListing ))
 


  //detail
  router.get('/:id',wrapAsync( detailListing))

  //listing

  router.get("/",wrapAsync( listingData))


  module.exports= router;