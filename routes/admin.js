const express=require('express');
const path=require('path');
const router=express.Router();

const admincontroller=require('../controllers/admin');
const isAuth=require('../middleware/is-auth');

router.get('/add-product',isAuth,admincontroller.getaddproduct);

router.get('/admin-products',isAuth,admincontroller.getadminproducts);
router.get('/edit-product/:productId',admincontroller.geteditproduct);
router.post('/edit-product',admincontroller.posteditproduct);
router.post('/delete-product',admincontroller.postdeleteproduct);
router.post('/add-product',admincontroller.postaddproduct);


module.exports=router;
// exports.products=products;
