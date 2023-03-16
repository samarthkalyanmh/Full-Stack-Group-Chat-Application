
//ADD CODE TO STORE ONLY 1000 messages in localstorage
window.setInterval(async () => {
    try{
            const token = localStorage.getItem('GCtoken')

            const chatDisplayDiv = document.getElementById('chatwindow')

            let chats = localStorage.getItem('chats')
            updateOrNot(chats, chatDisplayDiv)

    } catch(err){
        console.log(err)
    }
}, 200000)    

//ADD CODE TO STORE ONLY 1000 messages in localstorage
window.addEventListener('DOMContentLoaded', async () => {
    try{
            const token = localStorage.getItem('GCtoken')

            if(token === null){
                window.location.href = '../Login/login.html'
            }

            const chatDisplayDiv = document.getElementById('chatwindow')

            let chats = localStorage.getItem('chats')

            updateOrNot(chats, chatDisplayDiv)

    } catch(err){
        console.log(err)
    }
})


async function updateOrNot(chats, chatDisplayDiv){
    try{
        const token = localStorage.getItem('GCtoken')

        let response
        // console.log(chats.length, chats)
        if(chats === null){

            response = await axios.get('http://localhost:4000/chat/getallchats?lastmessageid=0', {
                headers: {'authorization': token}
            })
            
            if(response.data.length != 0) {

                const stringifiedResponse = JSON.stringify(response.data)
                showMessages(response.data, chatDisplayDiv)
                localStorage.setItem('chats', stringifiedResponse)

            } else{
                showMessages(response.data, chatDisplayDiv)
            }

            

        } else{
            let parsedChats = JSON.parse(chats)
            let lastMessageId = parsedChats[parsedChats.length - 1].id
            // console.log(lastMessageId)

            response = await axios.get(`http://localhost:4000/chat/getallchats?lastmessageid=${lastMessageId}`, {
                headers: {'authorization': token}
            })

            // console.log('resuu', response.data)

            if(response.data.update){

                let newParsedChats = parsedChats.concat(response.data.newChats)
                // console.log('newParsedChats:', newParsedChats)
                showMessages(newParsedChats, chatDisplayDiv)
                localStorage.setItem('chats', JSON.stringify(newParsedChats))
            } else{
                showMessages(JSON.parse(chats), chatDisplayDiv)
            }
        }
    } catch(err){
        console.log(err)
    }
}


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
    localStorage.removeItem('chats')
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

            await axios.post('http://localhost:4000/chat/message', messageObj, {
                headers: {'authorization': token}
            })
        }

    } catch(err){
        console.log(err)
    }
}


//Group Code
function takeToAddGroupPage(e){
    e.preventDefault()
    window.location.href = '../Create-Group/addGroup.html'
}

function toggle(e){
    e.preventDefault()

    let secondColumn = document.getElementById('secondcolumn')
    let thirdColumn = document.getElementById('thirdcolumn')
    let toggleButton = document.getElementById('togglebutton')

    if(thirdColumn.getAttribute('hidden')){
        secondColumn.className = 'col-4'
        thirdColumn.removeAttribute('hidden')  
        toggleButton.innerText = 'Maximize'
    } else{
        thirdColumn.setAttribute('hidden', 'hidden')
        secondColumn.className = 'col-8' 
        toggleButton.innerText = 'Manage Users'
    }
}

async function showGroups(e){
    try{
            const response = await axios.get('http://localhost:4000/group/get-groups') 
    } catch(err){
        console.log(err)
    }
} 
