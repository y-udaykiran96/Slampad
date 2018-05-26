const mongoose = require('mongoose'),
      frndRequestSchema = new mongoose.Schema({
          id:{
              type: String,
              required: true
          },
          frnds:[
              {
                  name:{
                      type: String
                  },
                  status:{
                      type: String,
                      required: true
                  },
                  id:{
                      type: String,
                      required: true
                  }
              }
          ]
      }); 


// export frnd
module.exports = mongoose.model('frnds',frndRequestSchema);