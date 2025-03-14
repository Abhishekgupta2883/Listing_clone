const listing = require('../models/schema.js')
const review = require('../models/review.js')

module.exports.destroyReview = async (req,res)=>{
  let {id , rev} = req.params;
  await listing.findByIdAndUpdate( id , {$pull :{reviews : rev}});
  await review.findByIdAndDelete(rev);
  req.flash("success", "Review Deleted")
  res.redirect(`/listing/${id}`)
}
module.exports.postReview = async(req,res)=>{
      let {id} = req.params;
      let newrev = req.body.review;
      list = await listing.findById( req.params.id);
      
      let rev = new review(newrev);
      rev.author = req.user._id;
     
      list.reviews.push(rev);
      await rev.save();
      await list.save();
      req.flash("success", "New Review Created")
      res.redirect(`/listing/${id}`)
    }


