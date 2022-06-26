function create_user()
{
    user_input = document.getElementById("user_input").value
    password = document.getElementById("password").value
    if (user_input != '' && password != '' && account_validator(user_input, password))
    {
        table = {'USERNAME': user_input, 'PASSWORD': password}
        fetch('http://localhost:3001/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(table),
        }).then((res) => { console.log(res) } ).catch((err) => { console.log(err) })
        window.location.href = 'http://localhost:3001/login'
    }
    
}

function account_validator(username, password)
{
    if (username.length < 8)
    {
        user_response = document.getElementById('response')
        user_response.innerHTML = "Username must be of length 8"
        return false
    } 
    if (password.length < 8)
    {
        password_response = document.getElementById('response')
        password_response.innerHTML = "Password must be of length 8"
        return false
    } 
    http_request = new XMLHttpRequest()
    http_request.open('GET', 'http://localhost:3001/api', false)
    http_request.send()
    users = JSON.parse(http_request.responseText)
    for (i in users)
        {   
            json = users[i]
            if (user_input === json['USERNAME'])
            {
                user_exists = document.getElementById('response')
                user_exists.innerHTML = "Username already taken"
                return false
            }
        }

    return true
}

