async function signup(e){
    
    try{
        e.preventDefault()

        let name = document.getElementById('name').value
        let email = document.getElementById('email').value
        let password = document.getElementById('password').value
    
    
        const userDetails = {
            name,
            email,
            password
        }
    
        const response = await axios.post('http://localhost:4000/user/signup', userDetails)

        if(response.status === 201){

            displayMessage(response.data.message, true)
            setTimeout(() => {
                window.location.href = "../Login/login.html"
            }, 1000)
        }
        else {
            throw new Error(response.data.message)
        }

    } catch(errMessage){
        console.log(errMessage)  
        displayMessage(errMessage, false)
    }
}

function displayMessage(msg, successOrFailure){

    const errorDiv = document.getElementById('message')

        errorDiv.innerHTML = ''

    if(successOrFailure){
        errorDiv.innerHTML +=  `<h2 style="text-align:center; color:green; margin-top:30px;">${msg}</h2>`
    } else{
        errorDiv.innerHTML +=  `<h2 style="text-align:center; color:red; margin-top:30px;">${msg}</h2>`
    }       
}