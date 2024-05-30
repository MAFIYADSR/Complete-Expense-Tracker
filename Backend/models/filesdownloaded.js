const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Filesdownloaded = sequelize.define('filesdownloaded', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    filesUrl: Sequelize.STRING,
    userid: Sequelize.INTEGER
})

module.exports = Filesdownloaded;