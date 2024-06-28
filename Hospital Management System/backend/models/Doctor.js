const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Staff = require('./Staff');

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
    }
}, {
    tableName: 'doctor', // Table names are usually in lowercase
    timestamps: false
});

// Associations
Doctor.belongsTo(Staff, { foreignKey: 'Emp_ID' });
Staff.hasOne(Doctor, { foreignKey: 'Emp_ID' });

module.exports = Doctor;
