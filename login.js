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
const methodOverride = require('method-override')
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session(
    {
        secret: 'wow',
        secure: true,
        httpOnly: true,
        resave: false,
        saveUninitialized: false
    }
))
app.use(passport.initialize())
app.use(passport.session())
app.use(cors());
app.use(express.json())
app.use(express.static("public")) 
app.use(methodOverride('_method'))

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
passport.serializeUser((user, cb) => cb(null, user.USERNAME));
  
passport.deserializeUser((id, cb) => cb(null, row));

function check_user_authentication(req, res, next)
{
    console.log(req.isAuthenticated())
    if (req.isAuthenticated())
    {
        return next()
    }
    res.redirect('/login')
}
function check_user_not_authenticated(req, res, next)
{
    if (req.isAuthenticated())
    {
        return res.redirect('/joke')
    }
    next()
}
app.delete('/logout', (req, res) =>
{
    req.logout((err) =>
    {
        if (err)
        {
            return next(err)
        }
        res.redirect("/")
    })
})

app.get('/test', check_user_authentication, (req, res) =>
{
    res.render('test.ejs', { name: req.user.USERNAME })
})
app.get('/login', check_user_not_authenticated, (req, res) =>
{
    res.render('login.ejs')
})
app.get('/', (req, res) =>
{
    res.render('index.ejs')
})
app.post('/login/password', 
    passport.authenticate('local', 
    { 
        failureRedirect: '/login',
        successRedirect: '/joke',
        failureFlash: true }
))
app.get('/joke', async(req, res) =>
{
    response = await axios.get("https://v2.jokeapi.dev/joke/Any?safe-mode")
    output = response.data 
    if (output.setup)
    {
        result = [output.setup, output.delivery]
    }
    else{
        result = output.joke
    }
    res.render('guess_joke.ejs', { output: result })
})
app.post('/guess_check', async(req, res) =>
{
    user_guess = req.body.user_guess
    result = req.body.result
    output = check(user_guess, result)
    res.render('response.ejs')
})

function check(user_guess, answer){
    if (user_guess.toLowerCase() == answer.toLowerCase())
    {
        return "You already knew the joke"
    }else
    {
        return answer
    }
}

app.listen(3001);