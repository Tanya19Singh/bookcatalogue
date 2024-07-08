// const Order = require('../models/order');
const Product=require('../models/product');//importing the class
const Order=require('../models/order');
const axios=require('axios');

exports.getproducts=async(req,res,next)=>{
    
  const res1=await axios.get('https://www.googleapis.com/books/v1/volumes?q=subject:fiction&key=AIzaSyBnYQWPPX_n381uO10ZXqfmy_yEksReI48');
  const res2=await axios.get('https://www.googleapis.com/books/v1/volumes?q=subject:geopolitics&key=AIzaSyBnYQWPPX_n381uO10ZXqfmy_yEksReI48');
  const res3=await axios.get('https://www.googleapis.com/books/v1/volumes?q=subject:novel&orderBy=newest&key=AIzaSyBnYQWPPX_n381uO10ZXqfmy_yEksReI48');
  const res4=await axios.get('https://www.googleapis.com/books/v1/volumes?q=subject:poetry&key=AIzaSyBnYQWPPX_n381uO10ZXqfmy_yEksReI48');
  const prod1=res1.data.items;
  const prod2=res2.data.items;
  const prod3=res3.data.items;
  const prod4=res4.data.items;

    console.log(prod1);
         res.render('shop/productlist',{
            prods1:prod1,
            prods2:prod2,
            prods3:prod3,
            prods4:prod4,
            doctitle:'shop',
            path:'/',
            isAuthenticated:req.session.isLoggedIn,
        })

    }
     


exports.getproduct=(req,res,next)=>{
    const prodId=req.params.productId;

    axios.get('https://www.googleapis.com/books/v1/volumes/'+prodId+'?key=AIzaSyBnYQWPPX_n381uO10ZXqfmy_yEksReI48')
    .then(result=> {
        const book=result.data;
        console.log(book);
         res.render('shop/product-detail',{
            product:book,
            doctitle:book.volumeInfo.title,
            path:'/products',
            isAuthenticated:req.session.isLoggedIn,
        })

    })
    .catch(err=>console.log(err))
    
}
exports.getindex=(req,res,next)=>{
    //-------callback approach when file was used to store the data-----
    //  Product.fetchAll(products=>{
    // res.render('shop/index',{prods:products,doctitle: 'shop',path:'/',hasproducts: products.length>0, activeshop:true, productsCSS:true});
    // });
    // -----------sql method---------
    // Product.fetchAll()
    // .then(([rows,fielddata])=>{
    //     res.render('shop/index',{
    //         prods:rows,
    //         doctitle:'shop',
    //         path:'/'
    //     })

    // }).catch(err => console.log(err));
console.log(req.session.isLoggedIn);
const books=[];
        res.render('shop/index',{
            prods:books,
            doctitle:'shop',
            path:'/',
            isAuthenticated:req.session.isLoggedIn        })
}

exports.postindex=(req,res,next)=>{
    console.log(req.session.isLoggedIn);

   const search=req.body.bookName;
   console.log(search);
    axios.get('https://www.googleapis.com/books/v1/volumes?q='+search+'&key=AIzaSyBnYQWPPX_n381uO10ZXqfmy_yEksReI48')
    .then(result=> {
        const books=result.data.items;
        console.log(books);
        return res.render('shop/index',{
            prods:books,
            doctitle:'shop',
            path:'/',
            isAuthenticated:req.session.isLoggedIn,
        })

    })
    .catch(err=>console.log(err))

}

exports.postorder=(req,res,next)=>{
    const products=req.user.cart.items;
        const data=[];
        Promise.all(products.map(product => {
            const prodId = product.productId;
            return axios.get('https://www.googleapis.com/books/v1/volumes/' + prodId + '?key=AIzaSyBnYQWPPX_n381uO10ZXqfmy_yEksReI48')
                .then(result => {
                    data.push({ productData: result.data.volumeInfo.title, quantity: product.quantity });
                })
                .catch(err => {
                    console.log(err);
                });
        }))
    .then(()=>{
                const order=new Order({
                    user:{
                        email:req.user.email,
                        userId: req.user
                    },
                    products: data
                });
                return order.save();
            })
        .then(result=>{
            return req.user.clearCart();
        })
        .then(result=>{
            res.redirect('/orders');

        })
        .catch(err=>console.log(err))
    // .then(cart=>{
    //     fetchedCart=cart;
    //     return cart.getProducts();
    // })
    // .then(products=>{
    // return req.user
    //     .createOrder()
    //     .then(order=>{
    //     return order.addProducts(products.map(product=>{
    //     product.orderItem={quantity: product.cartItem.quantity};
    //     return product;
    //     }))})
    //     .catch(err=>{
    //     console.log(err)});
    // })
    // .then(result=>{
    //     return fetchedCart.setProducts(null);
    // })
}

exports.getOrders=(req,res,next)=>{
    Order.find({"user.userId": req.user._id})
        .then(orders=>{
            res.render('shop/orders',{
                doctitle: 'your orders',
                path:'/orders',
                 activeshop:true, 
                 productsCSS:true,
                orders:orders,
                isAuthenticated:req.session.isLoggedIn});

       
        })
        .catch(err=>{
            console.log(err);
        })
}
exports.getcart=(req,res,next)=>{
    // Cart.getcart(cart=>{
    //     Product.fetchAll(products =>{
    //         const cartproducts=[];
    //         for(product of products)
    //         {
    //             const cartproductdata=cart.products.find(prod=> prod.id===product.id);
    //             if(cartproductdata)
    //             {
    //                 cartproducts.push({productdata:product, qty:cartproductdata.qty});
    //             }
    //         }
    //         res.render('shop/cart',{
    //             path:'/cart',
    //             doctitle:'your cart',
    //             products: cartproducts
    //         })
    //     })
    // })
    // req.user.populate('cart.items.productId')
    // // .execPopulate()//populate does not return a promiseb
    // .then(user=>{
    //     console.log(user);
        const products=req.user.cart.items;
        const data=[];
        Promise.all(products.map(product => {
            const prodId = product.productId;
            return axios.get('https://www.googleapis.com/books/v1/volumes/' + prodId + '?key=AIzaSyBnYQWPPX_n381uO10ZXqfmy_yEksReI48')
                .then(result => {
                    data.push({ bookdata: result.data, quantity: product.quantity });
                })
                .catch(err => {
                    console.log(err);
                });
        })).then(() => {
            // Now that all data is fetched, render the page
            res.render('shop/cart', {
                path: '/cart',
                doctitle: 'your cart',
                products: data,
                isAuthenticated: req.session.isLoggedIn
            });
        });
    //     for(let product of products)
    //     {const prodId=product.productId;
    //         axios.get('https://www.googleapis.com/books/v1/volumes/'+prodId+'?key=AIzaSyBnYQWPPX_n381uO10ZXqfmy_yEksReI48')
    // .then(result=> {
        
    //      console.log(result.data);
    //      console.log(product.quantity);
    //         data.push({bookdata:result.data,quantity:product.quantity});
    //     })
    //     .catch(err=>{
    //         console.log(err);
    //     })        
    // }
    // res.render('shop/cart',{
    //     path: '/cart',
    //     doctitle: 'your cart',
    //     products:data,
    //     isAuthenticated:req.session.isLoggedIn
    
    // });
// }
// )
//     .catch(err=>console.log(err));
}

exports.postcart=(req,res,next)=>{
    const prodId=req.body.productId;
    
    
    
    req.user.addToCart(prodId)
    .then(result=>{
        res.redirect('/cart');

    })
    .catch(err=>{
        console.log(err);
    });
    // req.user.getCart()
    // .then(cart=>{
    //     fetchedCart=cart;
    //     return cart.getProducts({where:{id:prodId}});
    // })
    // .then(products=>{
    //     let product;
    //     if(products.length>0)
    //     {
    //         product=products[0];
    //     }
    //     if(product){
    //         const oldQuantity= product.cartItem.quantity;
    //         newQuantity=oldQuantity+1;
    //         return product;
    //     }

    //     return Product.findByPk(prodId);
    // })
    //     .then(product=>{
    //         return fetchedCart.addProduct(product,{
    //             through: {quantity: newQuantity}
    //         });
    // })
    // .then(()=>{
    //     res.redirect('/cart');
    // })
    // .catch(err=>console.log(err));
}

exports.postcartdeleteproduct=(req,res,next)=>{
    const prodId=req.body.productId;
    req.user.removeFromCart(prodId)
    .then(result=>{
        res.redirect('/cart');
    })
    .catch(err=>{
        console.log(err);
    })
    
   
}
exports.getcheckout=(req,res,next)=>{
   
    const products=req.user.checkout.items;
        const data=[];
        Promise.all(products.map(product => {
            const prodId = product.productId;
            return axios.get('https://www.googleapis.com/books/v1/volumes/' + prodId + '?key=AIzaSyBnYQWPPX_n381uO10ZXqfmy_yEksReI48')
                .then(result => {
                    data.push( result.data);
                })
                .catch(err => {
                    console.log(err);
                });
        })).then(() => {
            // Now that all data is fetched, render the page
            res.render('shop/checkout', {
                path: '/checkout',
                doctitle: 'your checkout',
                prods: data,
                isAuthenticated: req.session.isLoggedIn
            });
        });
    
}

exports.postcheckout=(req,res,next)=>{
    const prodId=req.body.productId;
    
    
    
    req.user.addToCheckout(prodId)
    .then(result=>{
        res.redirect('/checkout');

    })
    .catch(err=>{
        console.log(err);
    });
    
}

exports.postcheckoutdeleteproduct=(req,res,next)=>{
    const prodId=req.body.productId;
    req.user.removeFromCheckout(prodId)
    .then(result=>{
        res.redirect('/checkout');
    })
    .catch(err=>{
        console.log(err);
    })
    
   
}
// exports.getcheckout=(req,res,next)=>{
//     res.render('shop/checkout',{doctitle: 'your checkout',path:'/checkout', isAuthenticated:req.session.isLoggedIn});
    
//     // res.sendFile(path.join(rootdir,'views','shop.html'));
// }

