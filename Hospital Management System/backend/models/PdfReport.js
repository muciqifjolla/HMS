const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const PdfReport = sequelize.define('PdfReport', {
  Report_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  personal_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
},
report: {
  type: DataTypes.BLOB('long'), // Adjust this based on your needs
  allowNull: false,
},
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'reports',
  timestamps: false,
});

module.exports = PdfReport;
