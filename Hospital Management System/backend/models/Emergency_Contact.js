const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define the Emergency_Contact model
const Emergency_Contact = sequelize.define('Emergency_Contact', {
  Contact_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Contact_Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Phone: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Relation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Correctly set the foreign key, referencing the patient table
  Patient_ID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'patient', // Refer to the patient table
      key: 'Patient_ID', // Refer to the correct field in the patient table
    },
  },
}, {
  tableName: 'emergency_contact', // Correct table name
  timestamps: false,              // No automatic timestamps
});

module.exports = Emergency_Contact; // Correct module export
