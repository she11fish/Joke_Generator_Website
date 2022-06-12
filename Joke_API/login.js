const LocalStartegy = require('passport-local');
const axios = require('axios');
const passport = require('passport');
const express = require('express')
const session = require('express-session')
const cors = require('cors');
const bcrypt = require('bcrypt')
const app = express()
const sqlite3 = require('sqlite3')
const flash = require('express-flash')
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session(
    {
        secret: 'wow',
        resave: false,
        saveUninitialized: false
    }
))
app.use(passport.initialize())
app.use(passport.session())
app.use(passport.authenticate('session'));
app.use(cors());
app.use(express.json())
 
strategy = new LocalStartegy(function verify(username, password, cb)
{
    db = new sqlite3.Database('./user.db')
    db.all("SELECT * FROM ACCOUNTS", async function(err, data) {
        if (err) 
        { 
            return cb(err) 
        }
        if (!data)
        {
            return cb(null, false, { message: 'An error has occured while fetching the database' })
        }
        row = data.filter((row) => row.USERNAME === username)[0]
        if (!row) {
            return cb(null, false, { message: 'Username is not valid' })
        }
        if (await bcrypt.compare(password, row.PASSWORD))
        {
            return cb(null, row)
        }
        return cb(null, false, { message: 'Password is not correct' })
        })
    db.close()
    
})
passport.use(strategy) 
passport.serializeUser((user, cb) => cb(null, user.ID));
  
passport.deserializeUser((id, cb) => cb(null, row.ID));

app.get('/test', (req, res) =>
{
    res.send('Hello')
})
app.get('/login', (req, res) =>
{
    res.render('login.ejs')
})
app.post('/login/password', 
    passport.authenticate('local', 
    { 
        successRedirect: '/test',
        failureRedirect: '/login',
        failureFlash: true }
),)
app.listen(3001);