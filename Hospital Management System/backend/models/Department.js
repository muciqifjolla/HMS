
const { DataTypes } = require('sequelize'); // Import DataTypes for defining model fields
const sequelize = require('../config/database'); // Import the Sequelize instance

const Department = sequelize.define('Department', {
  Dept_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Dept_head: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Dept_name: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Emp_Count: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  tableName: 'department',
  timestamps: false,
});

module.exports = Department;
