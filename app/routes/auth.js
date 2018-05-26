const express = require('express'),
      router = express.Router(),
      passport = require('passport');



// users login
router.route('/google')
.get(passport.authenticate('google',{
  scope:['profile', 'email']
}))

// google auth callback route
router.route('/google/callback')
.get(passport.authenticate('google',{
  failureRedirect:'/'
}),(req,res)=>{
  res.redirect('/dashboard')
})


// users register
router.route('/register')
.get((req,res)=>{
  res.send('Users register')
})

// logout
router.route('/logout')
.get((req,res)=>{
  req.logout();
  res.redirect('/')
});

// facbook user login
router.route('/facebook')
.get(passport.authenticate('facebook'
));

// facebook callback
router.route('/facebook/callback')
.get(passport.authenticate('facebook',{
  failureRedirect: '/login'
}),(req,res)=>{
  res.redirect('/dashboard')
})


// export Router
module.exports = router
