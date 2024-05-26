const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Doctor = require('./Doctor'); 
const Patient = require('./Patient'); 
const Staff = require('./Staff'); 

const Appointment = sequelize.define('Appointment', {
  Appoint_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Scheduled_On: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  Doctor_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Doctor,
      key: 'Doctor_ID',
    },
  },
  Patient_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Patient,
      key: 'Patient_ID',
    },
  },
}, {
  tableName: 'appointment',
  timestamps: false,
});


Appointment.belongsTo(Doctor, { foreignKey: 'Doctor_ID' });
Appointment.belongsTo(Patient, { foreignKey: 'Patient_ID' });
Doctor.belongsTo(Staff, { foreignKey: 'Emp_ID', targetKey: 'Emp_ID' }); // Assuming Emp_ID is the foreign key to the Staff model


module.exports = Appointment;
