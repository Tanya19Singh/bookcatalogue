const mongoose=require('mongoose');
const User = require('./user');

const Schema=mongoose.Schema;

const productSchema=new Schema({
    title: {
        type:String,
        required:true
    },
    price:{
        type:Number,
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
    userId:{
        type: Schema.Types.ObjectId,
        ref:'User',//refrence of related model is given here
        required:true
    }
});

module.exports=mongoose.model('Product',productSchema);
