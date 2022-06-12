const sqlite3 = require('sqlite3')
const bcrypt = require('bcrypt')
username = "hackmenow"
password = "hackmenow"
db = new sqlite3.Database('./user.db')
    db.all("SELECT * FROM ACCOUNTS", async function(err, data) {
        if (err) { return cb(err) }
        if (!data)
        {
            return cb(null, false, { message: 'An error has occured while fetching the database' })
        }
        row = data.filter((row) => row.USERNAME === username)[0]
        console.log(row)
        if (!row) {
            return cb(null, false, { message: 'Username is not valid' })
        };
        if (await bcrypt.compare(password, row.PASSWORD))
        {
            return cb(null, row)
        }
        return cb(null, false, { message: 'Password is not correct' })
        });
    db.close();