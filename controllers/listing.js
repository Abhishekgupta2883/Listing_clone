const listing = require('../models/schema.js')

module.exports.destroyListing = async (req,res)=>{
    let {id }= req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted")
    res.redirect('http://localhost:3000/listing');
  }

module.exports.getEdit = async(req,res)=>{
    let {id }= req.params;
    let data = await listing.findById(id);
    let ori = data.image.url;
    console.log(ori)
    let original = ori.replace("/upload","/upload/h_200,w_300")

    if(!data){
      req.flash("error","Listing you requested does not exist! ")
      res.redirect('http://localhost:3000/listing')
    }
    res.render("edit.ejs",{data, original})
  }

  module.exports.putEdit = async(req,res)=>{
    let {id} = req.params;
    let data = await listing.findByIdAndUpdate(id,{...req.body.listing})
    if(typeof(req.file)!=="undefined"){
      let url = req.file.path;
      let fileName = req.file.filename;
      data.image = {url,filename} ;
      await data.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listing/${id}`)
  }

module.exports.addListing = (req,res)=>{
    res.render('new.ejs')
  }

module.exports.postListing = async (req,res,next)=>{
    // if(!req.body.listing){
    //   throw new expressError(400, "listing is missing");
    // }
    // console.log(req.body.listing)
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(req.body)
      let new1 = new listing (req.body.listing);
      new1.owner = req.user._id
      new1.image = {url,filename}
      await new1.save();
      req.flash("success", "New Listing Created")
      res.redirect('http://localhost:3000/listing')
   
  }

module.exports.detailListing= async(req,res)=>{
    let {id }= req.params;
    let data = await listing.findById(id).populate({path :'reviews', populate :{path:"author",} }).populate('owner');
    console.log(data)
    if(!data){
      req.flash("error","Listing you requested does not exist! ")
      res.redirect('http://localhost:3000/listing')
    }
    res.render('page.ejs',{data});
  }

  module.exports.listingData= async(req,res)=>{
      let data = await listing.find();
    
      res.render("index.ejs",{data})
    }