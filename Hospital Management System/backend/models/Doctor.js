const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Staff = require('./Staff');
const Users = require('./Users');

const Doctor = sequelize.define('Doctor', {
    Doctor_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Qualifications: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Emp_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'staff',
            key: 'Emp_ID'
        }
    },
    Specialization: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id'
        }
    }
}, {
    tableName: 'doctor', // Table names are usually in lowercase
    timestamps: false
});

// Associations
Doctor.belongsTo(Staff, { foreignKey: 'Emp_ID' });
Doctor.belongsTo(Users, { foreignKey: 'user_id' });

module.exports = Doctor;
