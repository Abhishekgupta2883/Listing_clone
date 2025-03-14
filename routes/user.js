const express = require('express')
const router = express.Router({mergeParams:true})
const user = require('../models/user.js')
const passport = require('passport')
const { saveRedirectUrl } = require('../middleware.js')
const { signupRoute, postSignup, getLogin,postLogin, logoutRoute } = require('../controllers/user.js')



router.get('/signup', signupRoute)

router.post('/signup', postSignup)

router.get('/login', getLogin)

router.post('/login', saveRedirectUrl, passport.authenticate(
    'local',{
        failureRedirect:"/login",
        failureFlash: true
    }
), postLogin)


router.get("/logout", logoutRoute )

module.exports = router