try{

} catch(err){
    
}

window.setInterval(async () => {
    try{
        const token = localStorage.getItem('GCtoken')

        const chatDisplayDiv = document.getElementById('chatwindow')
        

        const response = await axios.get('http://localhost:4000/chat/getallchats', {
            headers: {'authorization': token}
        })

        console.log(response)
    
        showMessages(response.data, chatDisplayDiv)

    } catch(err){
        console.log(err)
    }
}, 100000)

window.addEventListener('DOMContentLoaded', async () => {
    try{
            const token = localStorage.getItem('GCtoken')

            if(token === null){
                window.location.href = '../Login/login.html'
            }

            const chatDisplayDiv = document.getElementById('chatwindow')

            const response = await axios.get('http://localhost:4000/chat/getallchats', {
                headers: {'authorization': token}
            })

            // if(response.data.length === 0){
            //     chatDisplayDiv.innerHTML = '<p class="card-text">No messages yet</p>'
            // } else{
            //     showMessages(response.data, chatDisplayDiv)
            // }

            showMessages(response.data, chatDisplayDiv)

    } catch(err){
        console.log(err)
    }
})

function showMessages(data, chatDisplayDiv){

    if(data.length === 0){
        chatDisplayDiv.innerHTML = '<p class="card-text">No messages yet</p>'

    } else{
        chatDisplayDiv.innerHTML = ''
        data.forEach(element => {
            const p = document.createElement('p')
            p.className = 'cart-text'
            p.innerText = `${element.User.name}: ${element.chat}`
            chatDisplayDiv.appendChild(p)
          })
    }  
}

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
        }

    } catch(err){
        console.log(err)
    }
}