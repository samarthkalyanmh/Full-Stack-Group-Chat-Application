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
    
        await UserToGroup.create({UserId: req.user.id, groupGroupId: dbResponse.GroupId, admin: true}, { transaction: t }) 


        await t.commit()
        res.status(200).json({result: 'Successfully added Group'})

    } catch(err){
        await t.rollback()
        console.log(err)
    }
    
}


const getGroups = async (req, res, next) => {
    try{
        // console.log('user requesting for get groups>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', req.user.id)
        const dbResponse = await UserToGroup.findAll({
            where: {UserId: req.user.id},
            attributes: ['groupGroupId'],
        })

        let groupIdList = []
        dbResponse.forEach(element => {
            groupIdList.push(element.groupGroupId)  
        })

        // console.log('groups belonging to the user>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', groupIdList)

        //This below if cond is necessary coz if groupIdList array is empty then groupsIdsAndNamesList gets all the values in the table but actually nothing should get stored in it
        if(groupIdList.length != 0){

            const groupsIdsAndNamesList = await Group.findAll({
                where: {
                    GroupId: {
                        [Op.or]: groupIdList
                    }
                },
                attributes: ['GroupId', 'GroupName']
            })
                                
            // console.log('sending group id and names>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', groupsIdsAndNamesList)
            res.status(200).json({message: 'success', groupsIdsAndNamesList: groupsIdsAndNamesList})

        } else{
            res.json({message: 'User not part of any groups yet', groupsIdsAndNamesList: []})
        }
        

    } catch(err){
        console.log(err)
        res.status(500).json({message: 'Internal server error 500', err: err})
    }
}

const getUsers = async (req, res, next) => {

    const groupId = parseInt(req.query.GroupId)
    const dbResponse = await UserToGroup.findAll({
        where: {groupGroupId: groupId},
        attributes: ['UserId'],
    })

    let UserIdList = []

    dbResponse.forEach(element => {
        UserIdList.push(element.UserId)  
    })

    const userIdsAndNamesList = await User.findAll({
        where: {
            id: {
                [Op.or]: UserIdList
            }
        },
        attributes: ['id', 'name']
    })
                        
    console.log('groupIdList>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', userIdsAndNamesList)
    res.status(200).json({message: 'success', userIdsAndNamesList: userIdsAndNamesList})


}

module.exports = {
    addGroup,
    getGroups,
    getUsers
}