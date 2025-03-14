const user = require('../models/user.js')


module.exports.signupRoute = (req,res)=>{
    res.render('./user/signup.ejs')
}

module.exports.postSignup = async(req,res)=>{
    try {
        let {username , email , password}= req.body;
        console.log(password)
        const newUser = new user ({email,username})
        
        let registeredUser =await user.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return(err);
            }
            req.flash("success", "User Successfully Register")
            res.redirect('/listing');
        })
 

    } catch (error) {
        req.flash("error",error.message )
        res.redirect('/signup')
    }
}

module.exports.getLogin = (req,res)=>{
    res.render('./user/login.ejs')
}

module.exports.postLogin = async(req,res)=>{
    req.flash('success', "Welcome To Wanderland")
    console.log(res.locals)
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl)
}

module.exports.logoutRoute =(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you have logged out");
        return res.redirect("/listing");
    })
}