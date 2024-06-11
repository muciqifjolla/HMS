// backend/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Role = require('./Role');
const UserRole = require('./UserRole'); 


const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'users', 
  timestamps: false, 
});

// Associations
User.hasMany(UserRole, { foreignKey: 'user_id' });
UserRole.belongsTo(User, { foreignKey: 'user_id' });
UserRole.belongsTo(Role, { foreignKey: 'role_id' });


module.exports = User;
