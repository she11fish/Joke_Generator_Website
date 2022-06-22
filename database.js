const express = require('express')
const sqlite3 = require('sqlite3')
const cors = require('cors')
const bcrypt = require('bcrypt')
const app = express()

app.use(express.json())
app.use(cors());
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

app.listen(3000)
