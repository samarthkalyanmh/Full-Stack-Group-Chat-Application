
async function addGroup(e){

    try{
        e.preventDefault()

        let token = localStorage.getItem('GCtoken')
        let groupName = document.getElementById('groupname').value
        let groupDescription = document.getElementById('groupdescription').value

        let obj = {
            groupName,
            groupDescription
        }

        const response = await axios.post('http://localhost:4000/group/add-group', obj, {
            headers: {'authorization': token}
        })

        document.getElementById('groupname').value = ''
        document.getElementById('groupdescription').value = ''
        
        console.log(response.data.result)
    } catch(err){
        console.log(err)
    }
    
    
}











async function logOut(e){
    e.preventDefault()
    localStorage.removeItem('GCtoken')
    localStorage.removeItem('chats')
    window.location.href = '../Login/login.html'
}

