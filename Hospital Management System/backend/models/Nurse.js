const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Nurse = sequelize.define('Nurse', {
    Nurse_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,

  },
    Patient_ID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'patient',
      key: 'Patient_ID', 
    },
  },
  Emp_ID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'staff',
      key: 'Emp_ID', 
    },
  },
  
}, {
  tableName: 'nurse',
  timestamps: false,
});

module.exports = Nurse;
