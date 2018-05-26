const frndRequest = require('../models/frndrequest');
module.exports = {
    requestCountChecker: requestCountChecker
}

function requestCountChecker(req,res, next){
    // slamrequests
    var slamrequests = [];
    var count = 0;
    frndRequest.findOne({id:res.locals.user._id},(err,doc)=>{
        if(doc){
            doc.frnds.forEach(frndreq =>{
                      if (frndreq.status == 'requested')
                        slamrequests.push(frndreq);
                    });
                    if(slamrequests.length!=0){
                             count=  slamrequests.length;
                            } 
                  return count
                  next();
        }else {
            return count
            next()
        }
    });
  
    // .then((frndslist) => {
    //     console.log(frndslist)
    //     //loop through to find requests
    //     frndslist.frnds.forEach(frndreq =>{
    //       if (frndreq.status == 'requested')
    //         slamrequests.push(frndreq);
    //     })
    //     // log the slamrequests
    //     console.log(slamrequests + 'slamrequestes')
    //     if(slamrequests.length!=0){
    //      count=  slamrequests.length;
    //     } 
    // }).catch(err => console.error(err));

}