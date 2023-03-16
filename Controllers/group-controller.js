const User = require('../Models/user-model')
const Chat = require('../Models/chat-model')   
const Group = require('../Models/group-model')
const UserToGroup = require('../Models/userToGroup-model')
const sequelize = require('../util/database')
const { Op } = require('sequelize')

const addGroup = async (req, res, next) => {
    try{
        const t = await sequelize.transaction()
    
        const grpName = req.body.groupName
        const grpDescription = req.body.groupDescription
    
        const dbResponse = await Group.create({GroupName: grpName, GroupDescription: grpDescription, CreatedBy: req.user.id}, { transaction: t })
    
        console.log(dbResponse.GroupId)
    
        await UserToGroup.create({UserId: req.user.id, groupGroupId: dbResponse.GroupId}, { transaction: t }) 


        await t.commit()
        res.status(200).json({result: 'success'})

    } catch(err){
        await t.rollback()
        console.log(err)
    }
    
}


const getGroups = async (req, res, next) => {
    try{
        const dbResponse = await UserToGroup.findAll({
            where: {UserId: req.user.id},
            attributes: ['groupGroupId'],
        })

        let groupIdList = []
        dbResponse.forEach(element => {
            groupIdList.push(element.groupGroupId)  
        })
        
        // const groupIdList = dbResponse

        const groupsIdsAndNamesList = await Group.findAll({
            where: {
                GroupId: {
                    [Op.or]: groupIdList
                }
            },
            attributes: ['GroupId', 'GroupName']
        })
                            
        console.log('groupIdList>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', groupIdList)
        res.status(200).json({message: 'success', groupsIdsAndNamesList: groupsIdsAndNamesList})

    } catch(err){
        console.log(err)
        res.status(500).json({message: 'Internal server error 500', err: err})
    }
}


module.exports = {
    addGroup,
    getGroups
}