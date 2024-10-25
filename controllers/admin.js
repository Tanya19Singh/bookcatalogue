const { ValidationError } = require('sequelize');
const Product = require('../models/product');


exports.getaddproduct = (req, res, next) => {
  res.render('admin/edit-product', { doctitle: 'add-product', path: '/add-product',editing:false, errorMessage:0 });
}

exports.postaddproduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const des = req.body.des;
  console.log(image);
if(!image)
  {
    return res.status(422).render('admin/edit-product',{
      doctitle: 'add-product',
      path: '/add-product',
      editing:false,
      hasError:true,
      product:{
        title:title,
        price:price,
        des:des
      },
      errorMessage:"attached file is not image",
      ValidationError:[]
    })
  }
  const imgurl=image.path;
  const product=new Product({title:title, price:price, des:des , imgurl:imgurl, userId:req.user});
  product
    .save()
    .then(result=>{
      console.log("created product");
      res.redirect('/admin-products');
    })
    .catch(err=>{console.log(err);})
  
}
exports.getadminproducts = (req, res, next) => {
  Product.find()
  .then(products => {
    console.log(products);
    res.render('admin/admin-products', { prods: products, doctitle: 'admin products', path: '/admin-products', hasproducts: products.length > 0, activeshop: true, productsCSS: true  });
  }).catch(err=>{console.log(err);});
}

exports.geteditproduct = (req, res, next) => {
  const editMode=req.query.edit;
  if(!editMode){
    return res.redirect('/');
  }
  const prodId=req.params.productId;
  Product.findById(prodId)
  .then(product=>{
    if(!product)
      return res.redirect('/');
    res.render('admin/edit-product', { doctitle: 'add-product', path: '/edit-product', editing: editMode, product:product ,errorMessage:''});

  }).catch(err=>{console.log(err)});
}

exports.posteditproduct=(req,res,next)=>{
    const prodId=req.body.productId;
    const updatedtitle=req.body.title;
    const updatedprice=req.body.price;
    const image=req.file;
    const updateddes=req.body.des;

Product.findById(prodId).then(product=>{
  product.title=updatedtitle;
  product.price=updatedprice;
  product.des=updateddes;
  if(image)
    {
      product.imgurl=image.path;
    }
  return product.save();
})  
    .then(result=>{
      console.log('UPDATED PRODUCT');
      res.redirect('/admin-products');

    })
    .catch(err=>{console.log(err)})
}   

exports.postdeleteproduct=(req,res,next)=>{
const prodId=req.body.productId;
Product.findByIdAndDelete(prodId)
.then(()=>{
  console.log('DESTROYED PRODUCT');
  res.redirect('/admin-products');

})
.catch(err=>{
  console.log(err);
})
}

exports.getproducts = (req, res, next) => {
 
}
