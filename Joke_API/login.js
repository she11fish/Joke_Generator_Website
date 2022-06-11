const LocalStartegy = require('passport-local');
const axios = require('axios');
const passport = require('passport');
const express = require('express')
const cors = require('cors')
const app = express()

strategy = new LocalStartegy(async function verify(username, password, cb)
{
    console.log('ok')
    data = await axios.get('http://localhost:3000/api')
    const data = data.data
    if (!data)
    {
        return cb(null, false, { message: 'An error has occured while fetching the database'})
    }
    row = data.filter((row) => row.USERNAME === username)
    if (!row) {
        return cb(null, false, { message: 'Username is not valid' })
    };
    if (await bcrypt(password, row.PASSWORD))
    {
        return cb(null, row.USERNAME)
    }
    return cb(null, false, {message: 'Password is not correct'})
})


app.use(cors());
app.use(express.json())
passport.use(strategy)  
app.post('/login', 
    passport.authenticate('local', {failureRedirect: '/login', failureMessage: true}),
    function(req, res)
    {
        res.redirect('/views/guess_joke')
    })

app.listen(5500);