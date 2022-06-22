const { response } = require("express")

function create_user()
{
    user_input = document.getElementById("user_input").value
    password = document.getElementById("password").value
    if (user_input != '' && password != '' && account_validator(user_input, password))
    {
        table = {'USERNAME': user_input, 'PASSWORD': password}
        fetch('http://localhost:3000/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(table)
        }).then((res) => { console.log(res) } ).catch((err) => { console.log(err) })
    }
    
}

function account_validator(username, password)
{
    if (username.length < 8)
    {
        user_response = document.getElementById('response')
        user_response.innerHTML = "Username must be of length 8"
        style = document.createElement('style')
        style.type = 'text/css'
        style.innerHTML = '#respond { text-align: center; position: relative; bottom: 105px; }';
        document.getElementsByTagName('head')[0].appendChild(style);
        return false
    } 
    if (password.length < 8)
    {
        password_response = document.getElementById('response')
        password_response.innerHTML = "Password must be of length 8"
        style = document.createElement('style')
        style.type = 'text/css'
        style.innerHTML = '#respond { text-align: center; position: relative; bottom: 105px; }';
        document.getElementsByTagName('head')[0].appendChild(style);
        return false
    } 
    let i = 0
    fetch("http://localhost:3000/api")
        .then((data) => data.json()).then((users) =>
        {
            for (i in users)
            {   
                json = users[i]
                if (user_input === json['USERNAME'])
                {
                    user_exists = document.getElementById('response')
                    user_exists.innerHTML = "Username already taken"
                    style = document.createElement('style')
                    style.type = 'text/css'
                    style.innerHTML = '#respond { text-align: center; position: relative; bottom: 105px; }';
                    document.getElementsByTagName('head')[0].appendChild(style);
                    return false
                }
            }
        })
        .catch((err) => { console.log(err) })
    
    return true
}

