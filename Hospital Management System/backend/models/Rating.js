const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const EMP = require('./Staff');

const Rating = sequelize.define('Rating', {
   Rating_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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

Rating.belongsTo(EMP, { foreignKey: 'Emp_ID' });


module.exports = Rating; 
