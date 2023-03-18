const User = require('../Models/user-model')
const Chat = require('../Models/chat-model')    
const UserToGroup = require('../Models/userToGroup-model')

const addUser = async (req, res, next) => {
    try{
        const {name, email, groupId} = req.body

        // console.log('????????????????????????????????????????????????????????????????????????????????????', name, email, groupId)

        const userTryingToAdd = await UserToGroup.findOne({where: {
            UserId: req.user.id,
            groupGroupId: groupId
        }})

        if(userTryingToAdd.admin === true){
            const user = await User.findOne({where: {
                name: name,
                email: email
            }})
    
            if(user != null){
    
                const relation = await UserToGroup.findOne({where: {
                    UserId: user.id,
                    groupGroupId: groupId
                }})
    
                if(relation === null){
                    const info = await UserToGroup.create({UserId: user.id, groupGroupId: groupId, admin: false})
                    res.json({message: 'Successfully added user', user: {name: name, id: info.UserId}})
                } else{
                    res.json({message: 'User is already present in the group'})
                }
    
            } else{
                res.json({message: 'User details incorrect or User not registered'})
            }

        } else{
            res.json({message: 'You do not have admin rights to add a user'})
        }

        
        

    } catch(err){
        console.log(err)
        res.status(500).json({message: 'Internal server error 500', err: err})
    }
}

const makeUserAdmin = async (req, res, next) => {
    try{

        const {userIdToMakeAdmin, groupId} = req.body
        console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++', userIdToMakeAdmin, groupId)

        const userTryingToMakeOtherUserAdmin = await UserToGroup.findOne({where: {
            UserId: req.user.id,
            groupGroupId: groupId
        }})

        if(userTryingToMakeOtherUserAdmin.admin === true){
            const dbResponse = await UserToGroup.findOne({where:{
                UserId: userIdToMakeAdmin,
                groupGroupId: groupId
            }})
    
            if(dbResponse.admin === true){
                res.json({message: 'User is already a admin'})
    
            } else{
    
                await UserToGroup.update(
                    {
                        admin: true
                    }, 
                    {
                        where: {
                            UserId: userIdToMakeAdmin,
                            groupGroupId: groupId
                        }
                    })
    
                res.json({message: 'User is admin now'})
            }
        } else{
            res.json({message: 'You do not have admin rights to make another user admin'})
        }

        

    } catch(err){
        console.log(err)
        res.status(500).json({message: 'Internal server error 500', err: err})
    }
}


const removeUserFromGroup = async (req, res, next) => {
    try{
        const {userIdToRemove, groupId} = req.body
        
        const userTryingToRemove = await UserToGroup.findOne({where: {
            UserId: req.user.id,
            groupGroupId: groupId
        }})

        if(userTryingToRemove.admin === true){
            await UserToGroup.destroy({where: {
                UserId: userIdToRemove,
                groupGroupId: groupId
            }})

            res.json({message: 'Successfully deleted user', result: 'success'})

        } else {
            res.json({message: 'You do not have admin rights to remove a user', result: 'failure'})
        }

        


    } catch(err){
        console.log(err)
        res.status(500).json({message: 'Internal server error 500', err: err})
    }
}


module.exports = {
    addUser,
    makeUserAdmin,
    removeUserFromGroup
}