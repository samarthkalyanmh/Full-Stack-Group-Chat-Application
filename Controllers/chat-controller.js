const User = require('../Models/user-model')
const Chat = require('../Models/chat-model')    
const UserToGroup = require('../Models/userToGroup-model')


//ADD CODE TO STORE ONLY 1000 messages in localstorage
const getAllChats = async (req, res, next) => {
    try{

        //OLD CODE
            const lastMessageId = req.query.lastmessageid

            // console.log('Last message id>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ', lastMessageId)

            let chatsWithUsersName
            if(lastMessageId === '0'){

                // console.log('All chats sending>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
                chatsWithUsersName = await Chat.findAll({
                    attributes: ['id','chat','groupGroupId'],    
                    include: [{     
                        model : User,
                        attributes : ['name'],
                        required : true
                    }],
                  order : ['id']
                })
                
                return res.status(200).json(chatsWithUsersName)
                
                
            } else{
                //Replace below line with countAll
                let allChats = await Chat.findAll()

                // console.log(allChats)
                if(allChats != null) {
                    let lastMessageIdInDB = allChats[allChats.length - 1].id
                    lastMessageIdInDB = lastMessageIdInDB.toString()

                    if(lastMessageIdInDB === lastMessageId){
                        return res.status(200).json({update: false})
    
                    } else{

                        chatsWithUsersName = await Chat.findAll({
                            offset: parseInt(lastMessageId),  
                            attributes: ['id','chat','groupGroupId'],    
                            include: [{     
                                model : User,
                                attributes : ['name'],
                                required : true
                            }],
                          order : ['id']
                        })
    
                        return res.status(200).json({update: true, newChats: chatsWithUsersName})
                    }  
                }
            }

            /* To access name: chatsWithUsersName[i].User.name */

    } catch(err){
        console.log('Error in getAllChats function>>>>>>>>>>>>>>>>>>>>>>', err)
        res.status(500).json({message: 'Internal server error 500', err: err})
    }
}


//Should also check if the user belongs to the group
const messageReceived = async (req, res, next) => {

    try{
        console.log(req.body.message)
        const {message, groupId} = req.body

        const userSendingMessage = await UserToGroup.findOne({where: {
            UserId: req.user.id,
            groupGroupId: groupId
        }})

        if(userSendingMessage != null || userSendingMessage != undefined){

            const data = await Chat.create({chat: message, UserId: req.user.id, groupGroupId: groupId})

            res.status(200).json({message: 'successfully saved'})

        } else{
            res.json({message: 'You are not a part of the group in which you are trying to post message'})
        }

        

    } catch(err){
        console.log('error in messageReceived', err)
        res.status(500).json({message: 'Internal server error 500'})
    }
    
}

module.exports = {
    messageReceived,
    getAllChats
}