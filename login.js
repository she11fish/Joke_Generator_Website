const LocalStartegy = require('passport-local');
const axios = require('axios');
const passport = require('passport');
const express = require('express')
const session = require('express-session')
const cors = require('cors');
const bcrypt = require('bcrypt')
const flash = require('express-flash')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const db = require('./schema')

mongoose.connect('mongodb://localhost/userdb')

const app = express()
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

strategy = new LocalStartegy(async function verify(username, password, cb)
{
    try {
        const data = await db.find() 
        check(data, username, password)
    } catch {
        return cb(null, false, { message: 'An error has occured while fetching the database' })
    }

    async function check(data, username, password) {
        if (!data) return cb(null, false, { message: 'Could not find any data in the database' })
        
        row = data.find((row) => row.username === username)
        
        if (!row) return cb(null, false, { message: 'Username is not valid' })

        if (await bcrypt.compare(password, row.password)) return cb(null, row)
        
        return cb(null, false, { message: 'Password is not correct' })
    }
    
})

passport.use(strategy) 
passport.serializeUser((user, cb) => cb(null, user.username));
passport.deserializeUser((id, cb) => cb(null, row));

function check_user_not_authenticated(req, res, next)
{
    if (req.isAuthenticated()) return res.redirect('/joke')
    next()
}

app.get('/api', async (req, res) => {
    try {
        const data = await db.find()
        data ? res.status(201).send(data) : res.send("No users in the database")
    } catch {
        res.status(500).send('An error occured while fetching the database')
    }
    
})
app.post('/create', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    try {
        const hash_password = await bcrypt.hash(password, 10)
        await db.create({ username: username, password: hash_password })
        res.status(201).send()
    } catch {
        res.status(500).send()
    }
});

app.delete('/delete', (req, res) =>
{
    db.findByIdAndDelete(req.user.id, (err) =>
    {
        if (err) res.send(500).send("Could not delete user from the database")
    })
    res.redirect('/')
})

app.delete('/logout', (req, res) =>
{
    req.logout((err) =>
    {
        if (err) return next(err)
        res.redirect("/")
    })
})

app.get('/login', check_user_not_authenticated, (req, res) =>
{
    res.render('login.ejs')
})
app.get('/', (req, res) =>
{
    let delete_button = true
    req.isAuthenticated() ? delete_button = true : delete_button = false
    res.render('index.ejs', { delete_button: delete_button})
})
app.post('/login/password', 
    passport.authenticate('local', 
    { 
        failureRedirect: '/login',
        successRedirect: '/joke',
        failureFlash: true 
    }
))

app.get('/joke', async(req, res) =>
{
    response = await axios.get("https://v2.jokeapi.dev/joke/Any?safe-mode")
    output = response.data 
    output.setup ? result = [output.setup, output.delivery] : result = output.joke
    res.render('joke.ejs', { output: result })
})

app.post('/guess_check', async(req, res) =>
{
    user_guess = req.body.user_guess
    result = req.body.result
    output = check(user_guess, result)
    res.render('response.ejs')
})

function check(user_guess, answer){
    if (user_guess.toLowerCase() == answer.toLowerCase()) return "You already knew the joke"
    return answer
}

app.listen(3001);