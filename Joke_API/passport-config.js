
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcyrpt')


function initialize(passport, getUserByUsername) {
    const authenticateUser = (username, password, done) => {
        const user = getUserByUsername(username)
        if (user == null)
        {
            return done(null, false, { message: 'Username does not exist'})
        }
        try{
            if (await bcrypt.compare(password, user.PASSWORD))
            {
                return done(null, user) 
            }else
            {
                return done(null, false, {message: 'Password incorrect'})
            }
        } catch (err)
        {
            return done(err)
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'USERNAME', passwordField: 'PASSWORD'}, authenticateUser))
    passport.serliazer((user, done) => { })
    passport.deserliazer((id, done) => { })
}
module.exports = initialize