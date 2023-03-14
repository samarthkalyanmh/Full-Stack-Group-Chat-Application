try{

} catch(err){
    
}

window.addEventListener('DOMContentLoaded', async () => {
    try{
            const token = localStorage.getItem('GCtoken')

            const chatDisplayDiv = document.getElementById('chatwindow')
            chatDisplayDiv.innerHTML = ''

            const response = await axios.get('http://localhost:4000/chat/getallchats', {
                headers: {'authorization': token}
            })

            if(response.data.length === 0){
                chatDisplayDiv.innerHTML = '<p class="card-text">No messages yet</p>'
            } else{
                response.data.forEach(element => {
                    const p = document.createElement('p')
                    p.className = 'cart-text'
                    p.innerText = element.chat
                    chatDisplayDiv.appendChild(p)
                  })
            }

    } catch(err){

    }
})


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
        document.getElementById('messageinputbox').value = ''

        const messageObj = {
            message
        }

        if(message != '' || message != null){
            console.log('before emptying')
            await axios.post('http://localhost:4000/chat/message', messageObj, {
                headers: {'authorization': token}
            })
            console.log('emptying')
        }
        
        console.log('emptying')
    } catch(err){
        console.log(err)
        res.status(500).json(err, {message: 'Internal server error'})
    }
}