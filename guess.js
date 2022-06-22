async function generate_joke(url)
    {
        let json = await fetch(url)
            .then((res) => res.json())
            .catch(function (err) {
                console.log("There was a error with fetching the api")
                return Promise.reject(err)
            })
        let setup = json['setup']
        if (setup)
        {
            let joke = json['delivery']
            return Promise.resolve([setup,joke])
        }
        else
        {
            let joke = json['joke']
            return Promise.resolve(joke)
        }        
    }
let text = document.getElementById('response')
        generate_joke("https://v2.jokeapi.dev/joke/Any?safe-mode")
        .then(function (output) {
                var is_punchline = false
                if (Array.isArray(output))
                {
                    text.innerHTML = output[0]
                    text.insertAdjacentHTML('afterend', '<input type="text" id="user_input" />')
                    document.getElementById('user_input').insertAdjacentHTML('afterend', '<input type="button" value="Enter" id="the_guess" onclick="guess()"/>')
                    answer = output[1]
                    is_punchline = true
                }

                if (!is_punchline)
                {
                    text.innerHTML = output
                }
                executed = false
        })
        .catch(function (err) {
            text.innerHTML = err
        });

function guess(){
    if (!executed)
    {
        var user_guess = document.getElementById('user_input').value
        check(user_guess, answer)
    }
}

function check(user_guess, answer){
    if (user_guess.toLowerCase() == answer.toLowerCase())
    {
        document.getElementById('answer').innerHTML = "You already knew the joke"
        executed = true
    }else
    {
        document.getElementById('answer').innerHTML = answer
        executed = true
    }
}

