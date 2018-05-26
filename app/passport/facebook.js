const facebookStrategy = require('passport-facebook').Strategy,
      config = require('../config'),
      User = require('../models/user');


// create facbook strategy
const strategy = new facebookStrategy({
    clientID: config.facebookClinetID ,
    clientSecret: config.facebookSecret ,
    callbackURL: 'https://slampad.herokuapp.com/auth/facebook/callback',
    profileFields:['id', 'first_name','email','last_name','photos']
},(acessToken , refreshToken, profile,done)=>{

    
    // console.log(acessToken),
    // console.log(profile)

    const newUser = {
        googleID: profile.id,
        email:profile.emails[0].value,
        firstName: profile.name.familyName,
        lastName: profile.name.givenName,
        image: profile.photos[0].value
    };

    // lo the user
    console.log(newUser)

    // check if user already exist
    User.findOne({facebookID:profile.id})
    .then(user => {
        if(user){

            done(null, user)
        }else {

            // create user
            new User(newUser).save()
            .then(user => done(null, user))
            .catch(err => console.error(err))
        }
    }).catch(err => console.error(err))
    
})

// export facebook Strategy
module.exports = (passport) => {

    passport.use(strategy)

    //passport session
    passport.serializeUser((user, done)=>{
        done(null, user.id)
    });

    passport.deserializeUser((id, done)=>{
        User.findById(id).then( user => done(null, user))
    })
}