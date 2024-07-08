const express=require('express');
const path=require('path');

const router=express.Router();

const shopcontroller=require('../controllers/shop');
const isAuth=require('../middleware/is-auth');
router.get('/',shopcontroller.getindex);
router.post('/',shopcontroller.postindex);
router.get('/products',shopcontroller.getproducts);
router.get('/products/delete');//specific routes needed to be put first than dynamic to remove confusion
router.get('/products/:productId',shopcontroller.getproduct);//dynamic route so : is used
router.get('/orders',isAuth,shopcontroller.getOrders);
router.post('/create-order',shopcontroller.postorder);
router.get('/cart',isAuth,shopcontroller.getcart);
router.post('/cart',shopcontroller.postcart);
router.post('/cart-delete-item',shopcontroller.postcartdeleteproduct);
router.get('/checkout',isAuth,shopcontroller.getcheckout);
router.post('/checkout',shopcontroller.postcheckout);
router.post('/checkout-delete-item',shopcontroller.postcheckoutdeleteproduct);


module.exports=router;