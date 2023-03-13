import {io} from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket = io('/');

let lastMessageId = 0;

//FETCH ALL JOINED GROUPS ON DOCUMENT LOAD
document.addEventListener('DOMContentLoaded', async (e) =>{
    let listOfGroups = await axios.get('/group/getUserGroups');
    listOfGroups = listOfGroups.data.chatGroups;
    listOfGroups.forEach(async group => {
        addGroupToSideBar(group);
    })
})

//FETCH ALL USERS ON MODAL OPENING
document.querySelector('#newGroupBtn').addEventListener('click', async () => {
    const usersSelect = document.querySelector('#groupUsers');
    usersSelect.innerHTML = '';
    let usersList = await axios.get('/user/getUsers');
    usersList = usersList.data;
    usersList.forEach(user => {
        const option = document.createElement('option');
        option.innerHTML = user.name;
        option.setAttribute('value', user.id);
        usersSelect.appendChild(option);
    });
})

//CREATE NEW GROUP
document.querySelector('#createGroupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const groupName = document.querySelector('#newGroupName').value;
    const groupUsers = [];
    for(let option of document.querySelector('#groupUsers').options){
        if(option.selected){
            groupUsers.push(parseInt(option.value));
        }
    }
    const createGroup = await axios.post('/group/createGroup', {
        name: groupName,
        users: groupUsers
    });
    await axios.post('/admin/makeGroupAdmin',{
        chatGroupId: createGroup.data.id
    })
    addGroupToSideBar(createGroup.data);
})

//ADDS GROUPS TO THE SIDEBAR
async function addGroupToSideBar(group){
    const groupContainer = document.querySelector('.groupContainer');
    const userGroup = document.createElement('div');
    const groupName = document.createElement('h6');
    groupName.innerHTML = group.name;

    const lastMessage = document.createElement('p');
    lastMessage.setAttribute('class', 'text-muted');

    const lastMessageTime = document.createElement('p');
    lastMessageTime.setAttribute('class', 'time text-muted small');

    let groupData = await axios.get(`/message/lastMessage?groupId=${group.id}`);
    groupData = groupData.data;

    if(groupData.length >= 1){
        lastMessage.innerHTML = `${groupData[0].name} : ${groupData[0].message}`;
        lastMessageTime.innerHTML = `${groupData[0].createdAt}`;
    }else{
        lastMessage.innerHTML = `No Messages`;
        lastMessageTime.innerHTML = '00:00';
    }

    const partitionLine = document.createElement('hr');
    userGroup.appendChild(groupName);
    userGroup.appendChild(lastMessage);
    userGroup.appendChild(lastMessageTime);
    userGroup.appendChild(partitionLine);
    groupContainer.appendChild(userGroup);

    groupName.addEventListener('click', () => {
        showGroup(group.id, group.name);
    })
}

//DISPLAY GROUP NAME ON CLICK
async function showGroup(id, name){
    const groupChatHeader = document.querySelector('.groupChat');
    groupChatHeader.innerHTML = '';
    const groupNameH2 = document.createElement('h2');
    groupNameH2.innerHTML = name;

    //Check if user is admin of the group or not, if he's admin add admin button
    const checkGroupAdmin = await axios.get(`/admin/checkAdmin?groupId=${id}`);
    if(checkGroupAdmin.data){
        const adminBtn = document.createElement('button');
        adminBtn.setAttribute('class', 'btn btn-primary');
        adminBtn.setAttribute('style', 'display: inline; margin-left: 10px; background-color: #913175; border-color: #CD5888;');
        adminBtn.setAttribute('data-target', '#adminControls');
        adminBtn.setAttribute('data-toggle', 'modal');
        adminBtn.innerHTML = 'Manage Members';
        groupNameH2.appendChild(adminBtn);

        adminBtn.addEventListener('click', () => {
            showGroupParticipants(id);
        })
    }

    groupChatHeader.appendChild(groupNameH2);
    const horizontalLine = document.createElement('hr');
    groupChatHeader.appendChild(horizontalLine);
    document.querySelector('.welcomeMessage').setAttribute('style', 'display: none');
    createGroupChatScreen(id);
}

//SHOWS MESSAGE SCREEN
async function createGroupChatScreen(id){
    const groupMessagesBox = document.querySelector('.groupMessagesBox');
    groupMessagesBox.innerHTML = '';
    const chatPanel = document.querySelector('.chatPanel');
    chatPanel.setAttribute('style', 'margin-left: 10px; display: block;') 
    const formGroupId=  document.querySelector('#currentGroupId');
    formGroupId.value = id;
    fetchMessages(id);
}

document.querySelector('#sendMessage').addEventListener('click', async () => {
    const groupId = document.querySelector('#currentGroupId').value;
    const message = document.querySelector('#userMessage').value;
    await axios.post('/message/newGroupMessage', {
        message: message,
        chatGroupId: groupId
    })
    socket.emit('send-message', groupId);
    document.querySelector('#userMessage').value = '';
})

const fileInput = document.querySelector('#sendAttachment');
fileInput.addEventListener('change', async () => {
    const groupId = document.querySelector('#currentGroupId').value;
    const selectedFile = fileInput.files[0];
    console.log(selectedFile);
    await axios.post('/message/saveFile', {
        file: selectedFile,
        chatGroupId: groupId
    })
})

// FETCHES MESSAGES AND ADDS TO CHAT SCREEN
async function fetchMessages(id){
    const groupMessagesBox = document.querySelector('.groupMessagesBox');
    let messages = await axios.get(`/message/getGroupMessages/${id}`);
    const userId = messages.data.user;
    messages = messages.data.groupMessages;

    messages.forEach( message => {
        const row = document.createElement('div');
        row.setAttribute('class', 'row no-gutters');

        const col = document.createElement('div');
        const messageBody = document.createElement('div');

        if(message.UserId == userId){
            col.setAttribute('class', 'col-md-7 offset-md-9');
            messageBody.setAttribute('class', 'chat-bubble chat-bubble--right');
            messageBody.innerHTML = `<b>You</b> : ${message.message}`;
        }
        else{
            col.setAttribute('class','col-md-7');
            messageBody.setAttribute('class', 'chat-bubble chat-bubble--left');
            messageBody.innerHTML = `<b>${message.name}</b> : ${message.message}`;
        }
        
        row.appendChild(col);
        col.appendChild(messageBody);
        groupMessagesBox.appendChild(row);
    });

    if(messages[messages.length-1]){
        lastMessageId = parseInt(messages[messages.length-1].id);
    }

    socket.on('receive-message', async (group) => {
        if(group == id){
            console.log(lastMessageId);
            await fetchNewMessages(id, groupMessagesBox, userId);
        }
    })
}

async function fetchNewMessages(id, groupMessagesBox, userId){
    let newMessages = await axios.get(`/message/getMessages?groupId=${id}&lastMessage=${lastMessageId}`);
    newMessages = newMessages.data;

    if(newMessages[0]){
        await newMessages.forEach(message => {
            const row = document.createElement('div');
            row.setAttribute('class', 'row no-gutters');

            const col = document.createElement('div');
            const messageBody = document.createElement('div');

            if(message.UserId == userId){
                col.setAttribute('class', 'col-md-7 offset-md-9');
                messageBody.setAttribute('class', 'chat-bubble chat-bubble--right');
                messageBody.innerHTML = `<b>You</b> : ${message.message}`;
            }
            else{
                col.setAttribute('class','col-md-7');
                messageBody.setAttribute('class', 'chat-bubble chat-bubble--left');
                messageBody.innerHTML = `<b>${message.name}</b> : ${message.message}`;
            }
            
            row.appendChild(col);
            col.appendChild(messageBody);
            groupMessagesBox.appendChild(row);
        })
        lastMessageId = newMessages[newMessages.length-1].id;
    }
    return;
}

//SHOWS GROUP PATICIPANTS IN MODAL OF ADMIN
async function showGroupParticipants(id){
    const tableBody = document.querySelector('.groupParticipants');
    tableBody.innerHTML = '';

    let allUsers = await axios.get('/user/getUsers');
    allUsers = allUsers.data;

    allUsers.forEach(async user => {
        const tableRow = document.createElement('tr');
        const userName = document.createElement('th');
        userName.setAttribute('scope', 'row');
        userName.innerHTML = user.name;

        const column1 = document.createElement('td');
        const column2 = document.createElement('td');

        const removeAdmin = document.createElement('button');
        removeAdmin.setAttribute('class', 'btn btn-primary');

        const addAdmin = document.createElement('button');
        addAdmin.setAttribute('class', 'btn btn-primary');

        const removeButton = document.createElement('button');
        removeButton.setAttribute('class', 'btn btn-primary');

        const addToButton = document.createElement('button');
        addToButton.setAttribute('class', 'btn btn-primary');

        const isParticipant = await axios.get(`/group/checkGroupUser?groupId=${id}&userId=${user.id}`);
        if(isParticipant.data){
            const isAdmin = await axios.get(`/admin/checkAdmin?groupId=${id}&userId=${user.id}`)
            if(isAdmin.data){
                removeAdmin.innerHTML = 'Remove Admin';
                column1.appendChild(removeAdmin);
                removeAdmin.addEventListener('click', async () => {
                    await axios.post('/admin/removeAdmin',{
                        chatGroupId: id,
                        userId: user.id
                    });
                });
            }else{
                addAdmin.innerHTML = 'Make Admin';
                column1.appendChild(addAdmin);
                addAdmin.addEventListener('click', async () => {
                    await axios.post('/admin/makeNewAdmin',{
                        chatGroupId: id,
                        userId: user.id
                    });
                });
            }
            removeButton.innerHTML = 'Remove';
            column2.appendChild(removeButton);
            removeButton.addEventListener('click', async () => {
                await axios.post('/group/removeFromGroup',{
                    chatGroupId: id,
                    userId: user.id
                });
            })
        }else{
            addToButton.innerHTML = 'Add';
            column2.appendChild(addToButton);
            addToButton.addEventListener('click', async () => {
                await axios.post('/group/addNewGroupUser', {
                    chatGroupId: id,
                    userId: user.id
                }, { fields: ['chatGroupId', 'userId']});
            })
        }
        tableRow.appendChild(userName);
        tableRow.appendChild(column1);
        tableRow.appendChild(column2);
        tableBody.appendChild(tableRow);
    })
}