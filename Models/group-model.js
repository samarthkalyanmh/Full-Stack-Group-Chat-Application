const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const Group = sequelize.define('groups',{

    GroupId: {
        type : Sequelize.INTEGER, 
        autoIncrement : true,
        allowNull : false,
        primaryKey : true,
    },

    GroupName: {
        type: Sequelize.STRING,
        allowNull: false,        
    },

    GroupDescription: {
        type: Sequelize.STRING   
    },

    CreatedBy: {
        type: Sequelize.INTEGER,
        allowNull: false,   
    },
})

module.exports = Group