const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Patient = sequelize.define('Patient', {
    Patient_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Personal_Number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Patient_Fname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Birth_Date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Patient_Lname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Blood_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Phone: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    tableName: 'patient',
    timestamps: false,
  });
  
  module.exports = Patient;