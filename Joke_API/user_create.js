
async function create_user()
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
    if (password.length < 8)
    {
        response = document.getElementById('output')
        response.insertAdjacentHTML('afterend', '<div id = "reject_password"> <h2>Password must be of length 8</h2> </div>')
        style = document.createElement('style')
        style.type = 'text/css'
        style.innerHTML = '#reject_password { text-align: center; position: relative; bottom: 105px; }';
        document.getElementsByTagName('head')[0].appendChild(style);
        return false
    } 
    if (username.length < 8)
    {
        response = document.getElementById('output')
        response.insertAdjacentHTML('afterend', '<div id = "reject_user_name"> <h2>Username must be of length 8</h2> </div>')
        style = document.createElement('style')
        style.type = 'text/css'
        style.innerHTML = '#reject_user_name { text-align: center; position: relative; bottom: 105px; }';
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
                    response = document.getElementById('output')
                    response.insertAdjacentHTML('afterend', '<div id = "reject"> <h2>Username already taken</h2> </div>')
                    style = document.createElement('style')
                    style.type = 'text/css'
                    style.innerHTML = '#reject { text-align: center; position: relative; bottom: 105px; }';
                    document.getElementsByTagName('head')[0].appendChild(style);
                    return false
                }
            }
        })
        .catch((err) => { console.log(err) })
    
    return true
}

