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

app.get('/api', (req, res) => {
    
    db = new sqlite3.Database('./user.db')
    db.all("SELECT * FROM ACCOUNTS", function(err, data) {
        if(err)
        {
            console.log(err)
        }else{
            if (data)
            {
                res.send(data)
            }else
            {
                res.send("No users in the database")
            }
        }
    });
    db.close();
})
app.post('/create', async (req, res) => {
    const username = req.body.USERNAME
    const password = req.body.PASSWORD
    try {
        const hash_password = await bcrypt.hash(password, 10)
        console.log([username, hash_password])
        db = new sqlite3.Database('./user.db')
        db.run('INSERT INTO ACCOUNTS (USERNAME, PASSWORD) VALUES (?,?)', [username, hash_password])
        db.close()
        res.status(201).send()
    }catch {
        res.status(500).send()
    }
});

app.delete('/delete', (req, res) =>
{
    db = new sqlite3.Database('./user.db')
    db.run('DELETE FROM ACCOUNTS WHERE ID=?', [req.user.ID], (err) =>
    {
        if (err)
        {
            console.log("Could not delete user from the database")
        }
    })
    res.redirect('/')
})

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

app.get('/login', check_user_not_authenticated, (req, res) =>
{
    res.render('login.ejs')
})
app.get('/', (req, res) =>
{
    if (req.isAuthenticated())
    {
        res.render('index.ejs', { delete_button: true })
    }else
    {
        res.render('index.ejs', { delete_button: false })
    }
    
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
    if (user_guess.toLowerCase() == answer.toLowerCase())
    {
        return "You already knew the joke"
    }else
    {
        return answer
    }
}

app.listen(3001);