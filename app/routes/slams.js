const express = require('express'),
      router = express.Router(),
      {ensureAuth , ensureGuest} = require('../helpers/auth'),
      Slam = require('../models/slam');


router.route('/')
.get((req,res)=>{
  res.render('slams/index')
})

// add slam form
router.route('/add')
.get(ensureAuth,(req,res)=>{

  // render form
  res.render('slams/add',{
    id:req.user.id
  })
})

// share slam form
router.route('/share/:id')
.get((req,res)=>{
  res.render('slams/share')
}).post((req,res)=>{
  res.send(req.body)
})

// view the slma
router.route('/view/:id')
.get((req,res)=>{
    //find the slam with id
    Slam.findById(req.params.id)
    .then(slam =>{
      res.render('slams/show',{
        slam:slam
      })
    })
})

// delete the slma
router.route('/delete/:id')
.delete((req,res)=>{
     
      Slam.findByIdAndRemove(req.params.id)
      .then(()=> {
        res.redirect('/dashboard')
      }).catch(err => console.error(err))
  })

  // save the slam from the freind
  

// dlete slam
// export router
module.exports = router;
