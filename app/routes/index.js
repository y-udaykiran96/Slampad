const express = require('express'),
      router = express.Router(),
      {ensureAuth , ensureGuest} = require('../helpers/auth'),
      Slam = require('../models/slam'),
      frndRequest = require('../models/frndrequest'),
      controller = require('../controllers/controller');
      var slamLength
      var slmareqs = []
      var reqCount
      
// to get the request count
function getRequestCount(req,res,next){
  // find the requests of user
  frndRequest.findOne({id:res.locals.user._id},(err,doc)=>{
    if(doc){
         //count request of user
         console.log(doc)
          doc.frnds.forEach(frndreq =>{
            if(frndreq.status == 'requested'){
              slmareqs.push(frndreq)
            }
          });
          if(slmareqs.length!=0){
            console.log(slmareqs)
           reqCount = slmareqs.length;
           next()
          }else {
            reqCount = 0
            next()
          }
    }else {
       reqCount =0;
      next();
    }
  })
}

// home route
router.get('/',ensureGuest,(req,res)=>{

    // render home handlebar
    res.render('pages/index')
});


// slams
router.get('/dashboard', getRequestCount, ensureAuth, (req, res) => {
  
  // conenect socket
  
    Slam.find({owner:res.locals.user.googleID}).then(slams =>{
      //log slams
      console.log(slams);
      let status;
       if(!slamLength){
        // the assing current slam legth
        slamLength = slams.length;
        console.log(slamLength+ 'first slam length')
       }else {
        var  newSlamLegth = slams.length
         console.log(newSlamLegth)
       }
       if(slamLength < newSlamLegth ){
         status = 'added'
         slamLength = newSlamLegth
       }else if(slamLength > newSlamLegth){
         status= 'deleted'
         slamLength = newSlamLegth
       }
       res.render('pages/dashboard',{
        slams:slams,
        status: status,
        reqCount: reqCount
      })
       
     
    }).catch(err => console.error(err))
  
});

// About
router.get('/about',(req,res)=>{
  res.render('pages/about')
})

// login and register route
router.route('/login')
.get((req,res)=>{
  res.render('pages/loginandregister');
})


// export Router
module.exports = router
