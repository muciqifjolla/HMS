const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');
const Room = require('./Room');
const Medicine = require('./Medicine');

const Bill = sequelize.define('Bill', {
  Payment_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  DATE: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Other_charges: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  Total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  Patient_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Patient,
      key: 'Patient_ID',
    },
  },
  Room_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Room,
      key: 'Room_ID',
    },
  },
  Medicine_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Medicine,
      key: 'Medicine_ID',
    },
  },
}, {
  tableName: 'bill',
  timestamps: false,
});

Bill.belongsTo(Patient, { foreignKey: 'Patient_ID' });
Bill.belongsTo(Room, { foreignKey: 'Room_ID' });
Bill.belongsTo(Medicine, { foreignKey: 'Medicine_ID' });

module.exports = Bill;
