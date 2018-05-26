module.exports = {
  ensureAuth:(req,res,next)=>{

    // check if already authenticated
    if(req.isAuthenticated()){
      return next()
    }
    res.redirect('/dashboard')
  },
  ensureGuest:(req,res,next) =>{
    if(req.isAuthenticated()){
      res.redirect('/dashboard')
    }else {
      return next()
    }
  }
}
