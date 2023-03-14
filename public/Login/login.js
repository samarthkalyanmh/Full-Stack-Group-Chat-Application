async function login(e){
    
    try{
        e.preventDefault()

        let email = document.getElementById('email').value
        let password = document.getElementById('password').value
    
    
        const loginDetails = {
            email,
            password
        }
    
        const response = await axios.post('http://localhost:4000/user/login', loginDetails)

        if(response.status === 200){
            
            displayMessage(response.data.message, true)

            localStorage.setItem('GCtoken', response.data.token)

            const isPremiumUser = response.data.isPremiumUser

            setTimeout(() => {
                window.location.href = "../Home/home.html"
            }, 1000)
            
        } else {
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