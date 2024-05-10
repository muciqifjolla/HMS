const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');
const EMP = require('./Staff');

const Rating = sequelize.define('Rating', {
   Rating_ID: {
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
  Rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Comments: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Date: {
    type: DataTypes.DATE,
    allowNull: false,
  },

}, {
  tableName: 'rating', 
  timestamps: false,   
});

Rating.belongsTo(Patient, { foreignKey: 'Patient_ID' });
Rating.belongsTo(EMP, { foreignKey: 'Emp_ID' });


module.exports = Rating; 
