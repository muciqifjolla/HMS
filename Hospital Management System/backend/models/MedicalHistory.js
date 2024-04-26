const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MedicalHistory = sequelize.define('MedicalHistory', {
    Patient_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    Allergies: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Pre_Conditions: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'medical_history',
    timestamps: false,
});

module.exports = MedicalHistory;
