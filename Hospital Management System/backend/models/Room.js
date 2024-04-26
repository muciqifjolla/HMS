const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Room = sequelize.define('Room', {
Room_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
    Room_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
    Patient_ID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'patient',
      key: 'Patient_ID', 
    },
  },
  Room_cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  }
  
}, {
  tableName: 'room',
  timestamps: false,
});

module.exports = Room;
