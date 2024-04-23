const { DataTypes } = require('sequelize'); // Import DataTypes for defining model fields
const sequelize = require('../config/database'); // Import the Sequelize instance

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
    },
    Patient_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'appointment',
    timestamps: false,
  });
  
  module.exports = Appointment;