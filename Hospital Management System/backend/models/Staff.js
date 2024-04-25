const { DataTypes } = require('sequelize'); // Import DataTypes for defining model fields
const sequelize = require('../config/database'); // Import the Sequelize instance

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
  
  module.exports = Staff;