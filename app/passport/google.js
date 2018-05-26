const googleStrategy = require('passport-google-oauth20').Strategy,
      config = require('../config'),
      User = require('../models/user')

// create new googleStrategy ########################################
const strategy = new googleStrategy({
  clientID: config.googleClientID,
  clientSecret: config.googleClientSecret,
  callbackURL: '/auth/google/callback',
  proxy: true
}, (accessToken, refreshToken, profile, done)=>{

    // console.log(accessToken);
    // console.log(profile);

    // trim the profile pic
    const image = profile.photos[0].value.substring(0,profile.photos[0].value.indexOf('?'));

    // create new user
    const newUser = {
      googleID: profile.id,
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      image:image
    }

    // check if user already exists
   User.findOne({googleID:profile.id})
   .then(user =>{
     if(user){

       // return user
       done(null, user)
     }else {

       // create user
       new User(newUser).save()
       .then(user => done( null, user)).catch(error => console.error(error));
     }
   } ).catch(err => console.error(err));

});

// export strategy #####################################
module.exports = (passport)=>{
  passport.use(strategy)

  // passport sessions
  passport.serializeUser((user, done)=>{
    done(null, user.id);
  });

  passport.deserializeUser((id, done)=>{
    User.findById(id).then(user => done(null, user))
  })
}
