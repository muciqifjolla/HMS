const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Role = require('./Role');

const UserRole = sequelize.define('UserRole', {
    UserRole_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User', // Use the name of the model, not the imported variable
            key: 'user_id'
        }
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Role', // Use the name of the model, not the imported variable
            key: 'role_id'
        }
    }
}, {
    tableName: 'UserRole',
    timestamps: true,
});

// Define associations
// UserRole.belongsTo(User, { foreignKey: 'userId' });
// UserRole.belongsTo(Role, { foreignKey: 'roleId' });

// User.hasMany(UserRole, { foreignKey: 'user_id' });
// Role.hasMany(UserRole, { foreignKey: 'role_id' });

module.exports = UserRole;
