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
