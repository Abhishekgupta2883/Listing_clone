const mongoose = require('mongoose');

const listing = require('../models/schema.js')
const initdata = require('./data.js')

mongoose.connect('mongodb://127.0.0.1:27017/webs')
  .then(() => console.log('Connected!'));
  

  const init = async ()=>{
    await listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj , owner: "67b2009ab654ad9362d27c5e"}));
    await listing.insertMany(initdata.data);
    console.log("data was initialize");
  }

  init();