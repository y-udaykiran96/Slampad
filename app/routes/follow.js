const express = require('express'),
      router = express.Router(),
      User = require('../models/user'),
      frndRequest = require('../models/frndrequest'),
      {ensureAuth , ensureGuest} = require('../helpers/auth');


// list the users 
router.route('/')
.get(ensureAuth,(req,res)=>{
    User.find({})   
    .then(users =>{
        const newUsers = users.filter(user => user.googleID != res.locals.user.googleID);
        var newFrnds;

        // get the friends list of user
        frndRequest.findOne({ id: res.locals.user._id })
            .then(frnds => {
                // console.log(frnds)
                // then find frnds from doc
                newFrnds = frnds.frnds.filter(frnd => frnd.status == 'frnds');
                // console.log(newFrnds)
                // remove frnds from list of users
                // newUsers.forEach(finalUsers => {
                //     // newFrnds.forEach(f => {
                //     //     console.log(f);
                //     //     if (finalUsers.firstName == f.name) {
                //     //         return finalUsers;
                //     //         //log the final users
                //     //         console.log(finalUsers);
                //     //     }
                //     // })
                //     console.log(finalUsers)
                // });
                // copy the array
                var finalUsers = newUsers.slice();
                newUsers.map(user => {
                    newFrnds.map(frnd => {
                        if (user._id == frnd.id) {
                            // findthe index of elements
                            let index = newUsers.indexOf(user);
                            finalUsers.splice(index,1)
                        }
                    })
                });

                console.log(finalUsers + 'final')
                // render findfrnd page
        res.render('pages/findfrnds',{
            users: finalUsers
        });
            }).catch(err => console.log(err));
        
        
        
        
    }).catch( err => console.error(err));
});


// users profile
router.route('/profile/:id')
.get((req,res)=>{

    // find the user  
    User.findById(req.params.id)
    .then(user =>{

        //log user
        // console.log(user)
        res.render('pages/profile',{
            user:user
        })
    }).catch(err => console.log(err));
});

// //send frnd request
// router.route('/sendreq/:id')
// .get((req,res)=>{

//     // get the user to send request
//     User.findById(req.params.id)
//     .then(user =>{
//         console.log(user);

//         // the create a request
//         const serrequest = {
//             // id of current user
//             id:res.locals.user._id,
//             frnds:[
//                 {
//                     name:user.firstName,
//                     status:'pending',
//                     // id of the user to send request
//                     id:user._id
//                 }
//             ]
//         }

//         // create the receiver request
//         const receiverrequest = {

//             // id of receiver
//             id: user._id,
//             frnds:[
//                 {
//                     name:res.locals.user.firstName,
//                     status:'requested',
//                     id:res.locals.user._id
//                 }
//             ]
//         }

//         // log the request
//         // console.log(senderrequest),
//         // console.log(receiverrequest)

//         // first check if request already send
//         frndRequest.findOne({id:res.locals.user._id})
//         .then( sreq => {
//             if(sreq){
//                 console.log(sreq)

//             //     // loop through array and find the request that are alredy sent
//             //     sreq.frnds.forEach(reqs =>{
//             //         if(reqs.id == user._id){
//             //             console.log('request already sent')

//             //         }
//             //         else {

//             //             // add the request to the frnd list
//             //             sreq.update({$push:{frnds:{
//             //                 name: user.firstName,
//             //                 status: 'requested',
//             //                 id:user._id
//             //             }}}).then(frndlist =>{
//             //                 console.log(frndlist)
//             //             }).catch(err => console.error(err))
//             //         }
//             //     });
//             // }else {

//             //  // creates 
//             // new frndRequest(senderrequest).save()
//             // .then(sreq =>{
    
//             //     // then save receiver request
//             //     new frndRequest(receiverrequest).save()
//             //     .then(rreq => {
//             //         console.log(sreq + rreq)
//             //     }).catch(err => console.error(err))
//             // }).catch(err => console.error(err))
//             // }

            

//         // }).catch( err => console.error(err))

//         // first save sender 
//         // new frndRequest(senderrequest).save()
//         // .then(sreq =>{

//         //     // then save receiver request
//         //     new frndRequest(receiverrequest).save()
//         //     .then(rreq => {
//         //         console.log(sreq + rreq)
//         //     }).catch(err => console.error(err))
//         // }).catch(err => console.error(err))
        
//         // save the request

//     // }).catch( err => console.error(err))
    

// })

// send request
router.route('/sendreq/:id')
.get((req,res)=>{

    // find the details of the requested user
    User.findById(req.params.id)
    .then(requestedUser =>{

        // log requestedUser
        console.log(requestedUser);
        // create docs for requestedUser
        const sentFriendRequest = {
            id: requestedUser._id,
            frnds:[
                {
                    name:res.locals.user.firstName,
                    status: 'requested',
                    id: res.locals.user._id
                }
            ]
        }

        // create doc for current user
        const currentUser = {
            id:res.locals.user._id,
            frnds:[
                {
                    name:requestedUser.firstName,
                    status: 'reqpending',
                    id:requestedUser._id
                }
            ]
        }

          var alreadySent = []
        // check doc for current user
        frndRequest.findOne({id:res.locals.user._id})
        .then( currentdoc =>{
            if(currentdoc){

                // log 
                console.log('doc existed')
                currentdoc.frnds.forEach(doc =>{
                       // check id for frnds with requesting frn
                       console.log(doc + 'each doc')
                      if(doc.id == requestedUser._id){

                        // push to array
                        alreadySent.push(doc)
                      }
                });
                
                // console.log(alreadySent);
                // check if array is empty
                if(alreadySent.length == 0){

                    // then update and add user doc
                    currentdoc.update({$push:{frnds:{
                        name:requestedUser.firstName,
                        status:'reqpending',
                        id: requestedUser._id
                    }}}).then(()=> console.log('updated')).catch(err =>console.error(err))

                    // check if requested user has a doc
                    frndRequest.findOne({id:requestedUser._id})
                    .then(doc2 => {
                        if(doc2){

                            console.log(doc2 + 'req')

                            // update the doc with sent user
                            doc2.update({$push:{frnds:{
                                name: res.locals.user.firstName,
                                status: 'requested',
                                id: res.locals.user._id
                            }}})
                        }else {
                            new frndRequest(sentFriendRequest)
                            .save().then(response1 => {
                                console.log('doc2 created')
                            }).catch(err => console.log(err))
                        }
                        res.redirect('/')
                    })
                }else {
                      
                    console.log('request already sent')
                    console.log(alreadySent)
                    res.redirect('/')
                }

            }else {
                console.log('no doc found')

                // save doc of two users
                new frndRequest(currentUser).save()
                .then(result =>{

                    // check if requested user has already doc
                    frndRequest.findOne({id:requestedUser._id})
                    .then(doc => {
                        if(doc){
                            console.log(doc)
                            doc.update({$push:{frnds:{
                                name: res.locals.user.firstName,
                                status: 'requested',
                                id: res.locals.user._id
                            }}}).then(()=>console.log('updated')).catch(err => console.error(err))
                            res.redirect('/')
                        }else{
                        //     new frndRequest(sentFriendRequest).save()
                        //     .then(result1 =>{
        
                        //     }).catch(err => console.error(err))
                         }
                    })
                }).catch(err => console.error(err))
            }
        }).catch(err => console.error(err))
    }).catch( err => console.error(err))
});

// find frnds route
router.route('/findfrnds')
.get((req,res)=>{

});

// frnds requests
var slamrequests = [];
// check for requests 
router.route('/requests')
.get((req,res)=>{

    // get the 
    frndRequest.findOne({id:res.locals.user._id})
    .then((frndslist) => {

        console.log(frndslist)
       
        //loop through to find requests
        frndslist.frnds.forEach(frndreq =>{
           if (frndreq.status == 'requested')
            slamrequests.push(frndreq);
        })

        // log the slamrequests
        console.log(slamrequests)

        // remove dups fromarray if user reloads page


        if(slamrequests.length!=0){
            res.render('user/slamreqs',{
                reqs:slamrequests
            })
        }else {
            res.render('user/slamreqs')
        }
        
    }).catch(err => console.error(err))
})

// accept request 
router.route('/accept/:id')
.get((req,res)=>{
    //index of element
    var index;

   // create new array to hold updated list
  
    // find the doc of current user
    frndRequest.findOne({id:res.locals.user._id},(err,doc)=>{
        //log the doc
        console.log(doc)
        // doc.frnds.forEach(list =>{
        //     if(list.id = req.params.id){
        //     index = doc.frnds.indexOf(list)
        //     }
        // })
        frndRequest.updateOne({id:res.locals.user._id, 'frnds.id':req.params.id},{
            $set:{
                'frnds.$.status':'frnds'
            }
        },(err, resu)=>{
            frndRequest.updateOne({id:req.params.id, 'frnds.id':res.locals.user._id},{
                $set:{
                    'frnds.$.status':'frnds'
                }
            },(err ,resuu)=>{
                 // remove the accepted request
                 var newSlamrequests =[]
                 newSlamrequests.forEach(slamrequest =>{
                     if(slamrequest.id != req.params.id){
                         newSlamrequests.push(slamrequest)
                     }
                 });
              console.log(newSlamrequests)
                    slamrequests = newSlamrequests;
                    console.log(slamrequests)
                res.redirect('/users/requests')
            });

           

            // log the newslamReuests
            
        })
       
       
        //log index
        console.log(index)
    })
})

// friendlidt
var friendsList = [];
// get the frnds of the user
router.route('/frnds')
.get((req,res)=>{
   
    // get the doc of current user
    frndRequest.findOne({id:res.locals.user._id})
    .then(userDoc =>{
        //log doc
        console.log(userDoc)
        // filter the freiends of the user
        userDoc.frnds.forEach(list => {
            if(list.status == 'frnds'){
             friendsList.push(list);
            };
        });
       
        // remove dupliactes when page loads again
        // var flist = []
        // friendsList.forEach(frnd => {
        //     if (friendsList.indexOf(frnd) == -1) {
        //         flist.push(frnd)
        //     }
        // })
        // log the unique frnd list
        //  console.log(flist + 'unique')
        // log friends array
        // console.log(friendsList);

        //render the FriendsList
        res.render('user/friends', {
            friendsList: friendsList
        });

        // empty the array
        friendsList = []
    })
})

// delete frieds
router.route('/delete/frnd/:id')
    .get(function (request,response) {
        response.send('hello')
    });



// export the router
module.exports = router;