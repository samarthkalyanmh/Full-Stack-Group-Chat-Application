
//ADD CODE TO STORE ONLY 1000 messages in localstorage
window.setInterval(async () => {
    try{
            const token = localStorage.getItem('GCtoken')

            const chatDisplayDiv = document.getElementById('chatwindow')

            let chats = localStorage.getItem('chats')

            showGroups()
            // updateOrNot(chats, chatDisplayDiv)

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

            showGroups()
            // updateOrNot(chats, chatDisplayDiv)


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

    const groupNameDiv = document.getElementsByName('groupnamediv')

    console.log(typeof groupNameDiv.id)

    if(groupNameDiv.id === undefined){
        alert('Click on a group first to edit participants')
    } else {
        if(thirdColumn.getAttribute('hidden')){
            secondColumn.className = 'col-4'
            thirdColumn.removeAttribute('hidden')
            toggleButton.innerText = 'Maximize'
        } else{
            thirdColumn.setAttribute('hidden', 'hidden')
            secondColumn.className = 'col-8' 
            toggleButton.innerText = 'Edit Participants'
        }
    }

    
}

async function showGroups(e){
    try{

        const response = await axios.get('http://localhost:4000/group/get-groups', {
            headers: {'authorization': localStorage.getItem('GCtoken')}
        }) 
        // console.log(response.data.groupsIdsAndNamesList)
        const groupsIdsAndNamesList = response.data.groupsIdsAndNamesList

        // console.log('yo', groupsIdsAndNamesList)

        if(groupsIdsAndNamesList.length != 0){
            let groupsListDiv = document.getElementById('groupslist')
            groupsListDiv.innerHTML = ''

            groupsIdsAndNamesList.forEach(element => {
                groupsListDiv.innerHTML += `<li class="list-group-item"><a href="#" id ="${element.GroupId}" onclick="showGroupDetails(event)" >${element.GroupName}</a></li>`
            })

        }

        

    } catch(err){
        console.log(err)
    }
} 


async function showGroupDetails(e){

    try{
        const grpId = e.target.id
        const response = await axios.get(`http://localhost:4000/group/get-users?GroupId=${grpId}`, {
            headers: {'authorization': localStorage.getItem('GCtoken')}
        })
    
        const userIdsAndNamesList = response.data.userIdsAndNamesList
    
        let usersDiv = document.getElementById('userslist')
        usersDiv.innerHTML = ''
    
        //Showing group users in the edit participants section
        userIdsAndNamesList.forEach(element => {
    
            usersDiv.innerHTML += `<div class ="row"> <li class="list-group-item mt-2 col-13 mx-auto">${element.name}</li><div class="col-1"></div> <button type="button" onclick="makeUserAdmin(event)" id=${element.id} class="btn btn-outline-primary col-13 my-auto">Make Admin</button><div class="col-1"></div><button  onclick ="removeUserFromGroup(event)"type="button" id=${element.id} class="btn btn-outline-primary col-13 my-auto">Remove</button></div><br><p  class="text-center fst-italic  mx-auto" id="resultprinting"></p>`
        })
    
        //Write below code in a function
        const allChatsOfGroup = await axios.get(`http://localhost:4000/chat/getallchats?lastmessageid=0&groupid=${grpId}`, {
            headers: {'authorization': localStorage.getItem('GCtoken')}
        })
    
    
    
        
        //Changing group name
        const showGroupNameSpan = document.getElementById('groupnamespan')
        showGroupNameSpan.innerText = e.target.innerText
        
        //Setting id of group(Useful while sending message)
        const grpIdDiv = document.getElementsByName('groupnamediv')
        grpIdDiv.id = e.target.id
    
        //Display the groups chats
        const chatDisplayDiv = document.getElementById('chatwindow')
        showMessages(allChatsOfGroup.data.chatsOfTheGroup, chatDisplayDiv)
    
    } catch(err){
        console.log(err)
    }
    
}


//Not using this function anywhere right now
async function addUserToList(user){

    let usersDiv = document.getElementById('userslist')
    
    usersDiv.innerHTML += `<div class ="row"><li class="list-group-item mt-2 col-13 mx-auto">${user.name}</li><div class="col-1"></div> <button type="button" onclick="makeUserAdmin(event)" id=${user.id} class="btn btn-outline-primary col-13 my-auto">Make Admin</button><div class="col-1"></div><button  onclick ="removeUserFromGroup(event)"type="button" id=${user.id} class="btn btn-outline-primary col-13 my-auto">Remove</button></div><br>`

}

async function addParticipant(e){
    try{
        e.preventDefault()

        const name = document.getElementById('usersname').value
        const email = document.getElementById('usersemail').value
        const groupId = document.getElementsByName('groupnamediv').id

        const messageDiv = document.getElementById('useraddingresult')

        const obj = {
            name,
            email,
            groupId
        }

        const response = await axios.post('http://localhost:4000/admin/add-user', obj, {
            headers: {'authorization': localStorage.getItem('GCtoken')}
        })

        // console.log(response.data.message)
        
        messageDiv.innerText = ''
        messageDiv.innerText = response.data.message

        setTimeout(() => {
            messageDiv.innerText = ''
        }, 2000)

        // console.log(response.data.user)

        addUserToList(response.data.user)
        

    } catch(err){

    }
}

async function makeUserAdmin(e){
    try{
        const userIdToMakeAdmin = e.target.id

        const groupId = document.getElementsByName('groupnamediv').id

        const obj = {
            userIdToMakeAdmin,
            groupId
        }

        const response = await axios.post('http://localhost:4000/admin/make-user-admin', obj, {
            headers: {'authorization': localStorage.getItem('GCtoken')}
        })

        // console.log(response.data.message)
        const manageUsersMessageDiv = document.getElementById('manageusersmessagediv')
        manageUsersMessageDiv.innerText = ''

        manageUsersMessageDiv.innerText = response.data.message

        setTimeout(() => {
            manageUsersMessageDiv.innerText = ''
        }, 2000)


    } catch(err){
        console.log(err)
    }
}

async function removeUserFromGroup(e){
    try{    
        const userIdToRemove = e.target.id
        const groupId = document.getElementsByName('groupnamediv').id

        const messageDiv = document.getElementById('useraddingresult')

        const obj = {
            userIdToRemove,
            groupId
        }

        const response = await axios.post('http://localhost:4000/admin/remove-user', obj, {
            headers: {'authorization': localStorage.getItem('GCtoken')}
        })  



        messageDiv.innerText = ''
        messageDiv.innerText = response.data.message

        setTimeout(() => {
            messageDiv.innerText = ''
        }, 2000)

        const divToRemove = e.target.parentElement

        let usersDiv = e.target.parentElement.parentElement

        usersDiv.removeChild(divToRemove) 


    } catch(err){
        console.log(err)
    }
}