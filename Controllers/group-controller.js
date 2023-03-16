const User = require('../Models/user-model')
const Chat = require('../Models/chat-model')   
const Group = require('../Models/group-model')
const UserToGroup = require('../Models/userToGroup-model')
const sequelize = require('../util/database')

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


const getGroups = (req, res, next) => {

}


module.exports = {
    addGroup,
    getGroups
}