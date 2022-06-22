
function click_yes()
    {
        let text = document.getElementById('response')
        generate_joke("https://v2.jokeapi.dev/joke/Any?safe-mode")
        .then(function (output) {
                text.innerHTML = output
                for (let i = 0;i<output.length;i++)
                {
                    if (output[i] == '\n')
                    {
                        break;
                    }
                }
                
        })
        .catch(function (err) {
            text.innerHTML = err
        });
    }

function click_no()
{
    let text = document.getElementById('response')
    text.innerHTML = 'Lame'
}

function redirects()
{
    let texts = document.getElementById('test')
    texts.insertAdjacentHTML('afterbegin', '<meta http-equiv="refresh" content ="0; URL =\'http://127.0.0.1:5500/views/guess_joke.html\'" />')
}