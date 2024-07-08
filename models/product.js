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
// const getDb=require('../utils/database').getDb;
// const mongodb=require('mongodb');
// class Product{
//     constructor(title,price,des,imgurl,id,userId){
//         this.title=title;
//         this.price=price;
//         this.des=des;
//         this.imgurl=imgurl;
//         this._id= id? new mongodb.ObjectId(id):null;
//         this.userId=userId;
//     }
//     save(){
//         const db=getDb();
//         let dbOp;
//         if(this._id)
//         {//update the product
//             dbOp=db.collection('products').updateOne({_id:this._id},{$set: this});//updateOne({filter func.},{desired value})
//         }
//         else{
//             dbOp=db.collection('products').insertOne(this);
//         }
//         return dbOp
//             .then(result=>{
//                 console.log(result);
//             })
//             .catch(err=>{
//                 console.log(err);
//             })
//     }
//     static fetchAll()
//     {
//         const db=getDb();
//         return db.collection('products')
//         .find()        // find({title: 'book})...can b called as this too it will return all the products with "book" title...find() returns all products...it doesnt return promise instead returns cursor whichh allow to go through all the  elements step by  atep
//         .toArray()
//         .then(products=>{
//             console.log(products);
//             return products;
//         })
//         .catch(err=>{
//             console.log(err);
//         });
//     }

//     static findById(prodId){
//         const db=getDb();
//         return db.collection('products')
//         .find({_id:new mongodb.ObjectId(prodId)})//bcz in mongo id is not stored directly as a string its an object of objectid type
//         .next()
//         .then(product=>{
//             // console.log(product);
//             return product;
//         })
//         .catch(err=>{
//             console.log(err);
//         });
//     }

//     static deleteById(prodId){
//         const db=getDb();
//         return db.collection('products')
//         .deleteOne({_id: new mongodb.ObjectId(prodId)})
//         .then(result=>{
//             console.log("deleted");
//         })
//         .catch(err=>{
//             console.log(err);
//         });
//     }
// };

// module.exports=Product;