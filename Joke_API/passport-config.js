const LocalStartegy = require('passport-local');
const axios = require('axios')

strategy = new LocalStartegy(async function verify(username, password, cb)
{

    const data = axios.get('http://localhost:3000/api')
    .then(res => console.log(res.data))
    .catch(err => { console.log(err)})
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

