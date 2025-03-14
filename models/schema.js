const mongoose = require('mongoose');
const review = require ('./review.js');

const listingSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
       
    },
    image : {
       url : String,
       filename : String,
    },
    price : {
        type : Number,
        
    },
    location : {
        type : String,
    },
    country : {
        type : String,
        
    },
    reviews :[{
        type : mongoose.Schema.Types.ObjectId,
        ref :"review",
    },],
    owner :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    }
});

listingSchema.post('findOneAndDelete', async(list)=>{
    if(list){
        await review.deleteMany({_id :{$in :list.reviews }})
    }
    
} );

const listing = mongoose.model("listings", listingSchema);

module.exports= listing;
