const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const Part = sequelize.define('Part', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = Part;