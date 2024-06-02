const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');


const MedicalHistory = sequelize.define('MedicalHistory', {
   Record_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    Patient_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Patient,
            key: 'Patient_ID'
        }
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

MedicalHistory.belongsTo(Patient, { foreignKey: 'Patient_ID' });


module.exports = MedicalHistory;
