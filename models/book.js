const mongoose=require('mongoose');
const User = require('./user');

const Schema=mongoose.Schema;

const bookSchema=new Schema({
    title: {
        type:String,
        required:true
    },
    
    des:{
        type: String,
        required:true
    },
    imgurl:{
        type:String,
        required: true
    },
   
});

module.exports=mongoose.model('Book',bookSchema);
