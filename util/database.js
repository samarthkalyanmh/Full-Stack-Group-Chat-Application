const Sequelize = require('sequelize')
// require('dotenv').config()

const sequelize = new Sequelize(process.env.MY_SQL_SCHEMA_NAME, process.env.MY_SQL_USERNAME, process.env.MY_SQL_PASSWORD, {
    dialect: 'mysql',
    host: process.env.MY_SQL_HOST_NAME
})

module.exports = sequelize