const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const userSchema=new Schema({
    
    email:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    cart:{
        items:[{productId:{type: String,required:true}, quantity:{type:Number, required:true}}]
    },
    checkout:{
        items:[{productId:{type: String,required:true}}]
    }
})

userSchema.methods.addToCart=function(product){
            const cartProductIndex=this.cart.items.findIndex(cp=>{
            return cp.productId===product;
        })
        let newQuantity=1;
        const UpdatedCartItems=[...this.cart.items];

        if(cartProductIndex>=0)
        {
            newQuantity=this.cart.items[cartProductIndex].quantity + 1;
            UpdatedCartItems[cartProductIndex].quantity=newQuantity;
        }
        else{
            UpdatedCartItems.push({productId: product,quantity:newQuantity})
        }
        const updatedCart = {
            items: UpdatedCartItems
        }
       this.cart=updatedCart;
        return this.save();


}

userSchema.methods.removeFromCart=function(productId){
    const updatedCartItems=this.cart.items.filter(item=>{
        return item.productId!==productId;
    })
    this.cart.items=updatedCartItems;
    return this.save();

}
userSchema.methods.addToCheckout=function(product){
            const checkoutProductIndex=this.checkout.items.findIndex(cp=>{
            return cp.productId===product;
        })
        const UpdatedCheckoutItems=[...this.checkout.items];

        if(checkoutProductIndex<0)
        {
            UpdatedCheckoutItems.push({productId: product})
        }
        console.log(UpdatedCheckoutItems);
        const updatedCheckout = {
            items: UpdatedCheckoutItems
        }
       this.checkout=updatedCheckout;
        return this.save();


}

userSchema.methods.removeFromCheckout=function(productId){
    const updatedCheckoutItems=this.checkout.items.filter(item=>{
        return item.productId!==productId;
    })
    this.checkout.items=updatedCheckoutItems;
    return this.save();

}

userSchema.methods.clearCart=function(){
    this.cart={items:[]};
    return this.save();
}
module.exports=mongoose.model('User',userSchema);
// const getDb=require('../utils/database').getDb;
// const mongodb=require('mongodb');

// const ObjectId=mongodb.ObjectId;
// class User{
//     constructor(username,email,cart,id){
//         this.name=username;
//         this.email=email;
//         this.cart=cart;//cart will be ana object  like {items:[]}
//         this._id=id;
//     }

//     save(){
//         const db=getDb();
//         db.collection('users').insertOne(this);
//     }
//     addToCart(product){
//         const cartProductIndex=this.cart.items.findIndex(cp=>{
//             return cp.productId.toString()===product._id.toString();
//         })
//         let newQuantity=1;
//         const UpdatedCartItems=[...this.cart.items];

//         if(cartProductIndex>=0)
//         {
//             newQuantity=this.cart.items[cartProductIndex].quantity + 1;
//             UpdatedCartItems[cartProductIndex].quantity=newQuantity;
//         }
//         else{
//             UpdatedCartItems.push({productId: new ObjectId(product._id),quantity:newQuantity})
//         }
//         const updatedCart = {
//             items: UpdatedCartItems
//         }
//         const db=getDb();
//         console.log(updatedCart);
//         return db
//             .collection('users')
//             .updateOne(
//                 {_id:new ObjectId(this._id)},
//                 {$set: {cart: updatedCart}}
//             );

//     }

// getCart()
// {
//     const db=getDb();
//     const productIds=this.cart.items.map(i =>{
//         return i.productId;
//     });
//     return db.collection('products').find({_id: {$in: productIds}}).toArray().then(products=>{
//         return products.map(p=>{
//             return {...p, quantity: this.cart.items.find(i =>{
//                 return i.productId.toString()===p._id.toString();
//             }).quantity
//         }
//         })
//     })

// }

// deleteItemFromCart(productId){
//     const updatedCartItems=this.cart.items.filter(item=>{
//         return item.productId.toString()!==productId.toString();
//     });
//     const db=getDb();
//     return db.collection('users').updateOne({ _id: new ObjectId(this._id)},{ $set : {cart:{items: updatedCartItems}}})
// }

// addOrder()
// {
//     const db=getDb();
//     return this.getCart()
//     .then(products=>{
//         const order={
//             items:products,
//             user:{
//                 _id: new ObjectId(this._id),
//                 name:this.name
//             }
//         }
//         return db.collection('orders').insertOne(order);
//     })
//     .then(result=>{
//         this.cart={items: []};
//         return db.collection('users').updateOne({_id: new ObjectId(this._id)},
//         {$set: { cart: {items: []}}})
//     })

// }

// getOrders(){
// const db=getDb();
// return db
// .collection('orders')
// .find({'user._id': new ObjectId(this._id)})//in mongodb we access the nested property like here we access _id of  user by specifying it in ' '
// .toArray();
// }

//     static findById(userId){
//         const db=getDb();
//         return db.collection('users')
//         .findOne({_id:new ObjectId(userId)})
//         .then(user=>{
//             // console.log(user);
//             return user;
//         })
//         .catch(err=>{
//             console.log(err);
//         });
//     }
// }
// module.exports=User;