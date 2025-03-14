const { ref } = require('joi');
const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
    rating : {
        type : Number,
        min : 1,
        max : 5,
    },
    comment : String,
    created_at : {
        type : Date,
        default : Date.now()
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
    },
})

const review = mongoose.model("review", reviewSchema);
module.exports= review ;