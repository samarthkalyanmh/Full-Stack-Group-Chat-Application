const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const UserToGroup = sequelize.define('UserToGroup',{

    admin : { 
      type : Sequelize.BOOLEAN     
    }
})

module.exports = UserToGroup