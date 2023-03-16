const User = require('../Models/user-model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config

const generateAccessToken = (id, name) => {
    return jwt.sign({userId: id, name: name}, process.env.SECRET_KEY)
}

const signup = async (req, res, next) => {
    try{

        console.log('entering signup')

        const {name, email, password} = req.body

        const userTryingToSignup = await User.findAll({where: {email: req.body.email}})

        if(userTryingToSignup.length > 0){
            return res.status(400).json({ message: "user exists already, click on login" })

            // return res.json({message: "user exists already, click on login" }) // for this line of code in the UI the message itself gets printed not the status code
        }

        if(!name || !email || !password){
            return res.status(400).json({message: "bad parameters, something is missing"})

        } else{

            const salt = await bcrypt.genSalt(10)
            const hashedPass = await bcrypt.hash(password, salt)


            await User.create({ name, email, password: hashedPass}) 
            res.status(201).json({message: 'Successfully created new user'})
        }

    } catch(err){
        console.log(err)
        res.status(500).json(err, {message: 'Internal Server Error 500'})
    }
}

const login = async(req, res, next) => {
    try{ 
        const {email, password} = req.body

        console.log('entering login function')
        if(!email || !password){
            return res.status(400).json({message: "bad parameters"})
        }

        const userTryingToLogin = await User.findAll({where: {email: email}})

        if(userTryingToLogin.length === 0){
           return res.status(404).json({message: "User doesn't exist"})

        } else{

            bcrypt.compare(password, userTryingToLogin[0].password, (err, result) => {
                if(err){
                    throw new Error({message: "Something went wrong"})
                }
                if(result){
                    return res.status(200).json({message: "Login successful", 
                    token: generateAccessToken(userTryingToLogin[0].id, userTryingToLogin[0].name)})
                } else {
                    return res.status(400).json({message: "Incorrect password"})
                }
            })
        }
        
    } catch(err){
        console.log('err is ', err)
        res.status(500).json({err, message:'Internal server error 500'})
    }
}

module.exports = {
    signup,
    login
}