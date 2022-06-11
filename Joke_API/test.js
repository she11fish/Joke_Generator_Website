const axios = require('axios')
async function test()
{
    const data = await axios.get('http://localhost:3000/api')
    console.log(data.data)
}
test()
