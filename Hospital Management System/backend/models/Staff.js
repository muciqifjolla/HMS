// models/Staff.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Department = require('./Department'); // Import the Department model

const Staff = sequelize.define('Staff', {
  Emp_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Emp_Fname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Emp_Lname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Joining_Date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Emp_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Dept_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'department',
      key: 'Dept_ID',
    },
  },
  SSN: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  DOB: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Date_Separation: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'staff',
  timestamps: false,
});

// Define the association between Staff and Department
Staff.belongsTo(Department, { foreignKey: 'Dept_ID' });

module.exports = Staff;
