const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');
const Staff = require('./Staff');

const Nurse = sequelize.define('Nurse', {
    Nurse_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Patient_ID: {
        type: DataTypes.INTEGER,
        references: {
            model: 'patient',
            key: 'Patient_ID', 
        },
    },
    Emp_ID: {
        type: DataTypes.INTEGER,
        references: {
            model: 'staff',
            key: 'Emp_ID', 
        },
    },
}, {
    tableName: 'nurse',
    timestamps: false,
});

Nurse.belongsTo(Patient, { foreignKey: 'Patient_ID' });
Nurse.belongsTo(Staff, { foreignKey: 'Emp_ID' });

module.exports = Nurse;
