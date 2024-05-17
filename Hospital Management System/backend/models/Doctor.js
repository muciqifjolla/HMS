const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Staff = require('./Staff');
const User = require('./User');

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
            model: Staff,
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
            model: User,
            key: 'user_id'
        }
    }
}, {
    tableName: 'Doctors',
    timestamps: false
});

// Associations
Doctor.belongsTo(Staff, { foreignKey: 'Emp_ID' });
Doctor.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Doctor;
