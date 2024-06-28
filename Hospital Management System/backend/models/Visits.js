const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');
const Doctor = require('./Doctor');

const Visit = sequelize.define('Visit', {
    Visit_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Patient_ID: {
        type: DataTypes.INTEGER,
        references: {
            model: 'patients', // Refer to the correct table name
            key: 'Patient_ID'
        }
    },
    Doctor_ID: {
        type: DataTypes.INTEGER,
        references: {
            model: 'doctor', // Refer to the correct table name
            key: 'Doctor_ID'
        }
    },
    date_of_visit: {
        type: DataTypes.DATE,
        allowNull: false
    },
    condition: {
        type: DataTypes.STRING,
        allowNull: false
    },
    diagnosis: {
        type: DataTypes.STRING,
        allowNull: false
    },
    therapy: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'visits',
    timestamps: false
});

Visit.belongsTo(Patient, { foreignKey: 'Patient_ID' });
Visit.belongsTo(Doctor, { foreignKey: 'Doctor_ID' });

module.exports = Visit;
