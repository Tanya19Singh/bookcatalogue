module.exports=(req,res,next)=>{//checking authentication before routing using middleware
    if(!req.session.isLoggedIn){
        return res.redirect('/login');
    }
    next();
}