const mongoose = require('mongoose'),
      slamSchema = new mongoose.Schema({
          name:{
              type: String,
              required:true
          },
         mobile:{
             type: Number,
             required:true
         },
         email:{
             type: String,
             required:true
         },
         address:{
             type:String,
             required: true
         },
         nickname:{
             type: String
         },
         hobbies:{
             type: String
         },
         nativeplace:{
             type: String
         },
         favouriteplace:{
             type: String
         },
        likesofme:{
            type: String
        } ,
        dislikesofme:{
            type:String
        },
        describeme:{
            type:String
        },
        birthday:{
            type: String,
            required:true
        }
      });

// export schema
module.exports = mongoose.model('slams',slamSchema)