const Product=require('../models/product');
const Order=require('../models/order');
const axios=require('axios');
// const { GoogleGenerativeAI } =require ("@google/generative-ai");
// require ('dotenv').config();
// const genAI = new GoogleGenerativeAI(process.env.api_key);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


exports.getproducts=async(req,res,next)=>{
    
  const res1=await axios.get('https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=newest&key=AIzaSyBnYQWPPX_n381uO10ZXqfmy_yEksReI48');
  const res2=await axios.get('https://www.googleapis.com/books/v1/volumes?q=subject:geopolitics&orderBy=newest&key=AIzaSyBnYQWPPX_n381uO10ZXqfmy_yEksReI48');
  const res3=await axios.get('https://www.googleapis.com/books/v1/volumes?q=subject:novel&orderBy=newest&orderBy=newest&key=AIzaSyBnYQWPPX_n381uO10ZXqfmy_yEksReI48');
  const res4=await axios.get('https://www.googleapis.com/books/v1/volumes?q=subject:poetry&orderBy=newest&key=AIzaSyBnYQWPPX_n381uO10ZXqfmy_yEksReI48');
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
            path:'/products',
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
console.log(req.session.isLoggedIn);
axios.get('https://www.googleapis.com/books/v1/volumes?q=flowers&key=AIzaSyBnYQWPPX_n381uO10ZXqfmy_yEksReI48')
    .then(result=> {
        const books=result.data.items;
        console.log(books);
        res.render('shop/index',{
            prods:books,
            doctitle:'shop',
            path:'/',
            isAuthenticated:req.session.isLoggedIn        
        })
       
})
.catch(err=>console.log(err))
}

exports.postindex=(req,res,next)=>{
    console.log(req.session.isLoggedIn);

   const search=req.body.bookName;
   console.log(search);
    axios.get('https://www.googleapis.com/books/v1/volumes?q='+search+'&orderBy=newest&key=AIzaSyBnYQWPPX_n381uO10ZXqfmy_yEksReI48')
    .then(result=> {
        const books=result.data.items;
        // console.log(books);
        return res.render('shop/index',{
            prods:books,
            doctitle:'shop',
            path:'/',
            isAuthenticated:req.session.isLoggedIn,
        })

    })
    .catch(err=>console.log(err))

}

// // In your Node.js file
// exports.postrecommender = async (req, res, next) => {
//     console.log(req.session.isLoggedIn);
  
//     const genre = req.body.genre;
//     const language = req.body.lang;
//     const age = req.body.age;
//     const prompt = `give me just names of five ${genre} books in ${language} for age group: ${age}`;
  
//     try {
//       const result = await axios({
//         url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCoAVy5dHxNXeO7Vy34sFEbc7e5MZhjb6Y",
//         method: "post",
//         data: {
//           contents: [
//             { parts: [{ text: prompt }] },
//           ],
//         },
//       });
//       console.log(result);
  
//       const recommendation = result['data']['candidates'][0]['content']['parts'][0]['text'];
//       return res.render('shop/index',{
//         doctitle: 'shop',
//         recommendation,
//         path: '/',
//         isAuthenticated:req.session.isLoggedIn,
//     })
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Failed to generate content' });
//     }
//   };
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
            res.render('shop/cart', {
                path: '/cart',
                doctitle: 'your cart',
                products: data,
                isAuthenticated: req.session.isLoggedIn
            });
        });
   
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
   
    axios.get('https://www.googleapis.com/books/v1/volumes?q=flowers&filter=free-ebooks&orderBy=newest&key=AIzaSyBnYQWPPX_n381uO10ZXqfmy_yEksReI48')
    .then(result=> {
        const books=result.data.items;
        const allPagesBooks = books.filter(book => book.accessInfo.viewability === 'ALL_PAGES');
        console.log(allPagesBooks);
        res.render('shop/ebooks',{
            prods:allPagesBooks,
            doctitle:'ebooks',
            path:'/checkout',
            isAuthenticated:req.session.isLoggedIn        
        })
       
})
.catch(err=>console.log(err))
    
}

exports.postcheckout=(req,res,next)=>{
    const search=req.body.bookName;
   console.log(search);
    axios.get('https://www.googleapis.com/books/v1/volumes?q='+search+'&filter=free-ebooks&orderBy=newest'+'&key=AIzaSyBnYQWPPX_n381uO10ZXqfmy_yEksReI48')
    .then(result=> {
        const books=result.data.items;
        console.log(books);
        return res.render('shop/ebooks',{
            prods:books,
            doctitle:'ebooks',
            path:'/checkout',
            isAuthenticated:req.session.isLoggedIn,
        })

    })
    .catch(err=>console.log(err))
    
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

