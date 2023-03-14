async function logOut(e){
    e.preventDefault()
    localStorage.removeItem('GCtoken')
    window.location.href = '../Login/login.html'
}

async function sendMessage(e){
    e.preventDefault()

    try {
        const message = document.getElementById('messageinputbox').value
        const token = localStorage.getItem('GCtoken')

        const messageObj = {
            message
        }

        if(message != '' || message != null){

            const response = await axios.post('http://localhost:4000/chat/message', messageObj, {
                headers: {'authorization': token}
            })

            console.log(response)
        }

    } catch(err){
        console.log(err)
        res.status(500).json(err, {message: 'Internal server error'})
    }
}