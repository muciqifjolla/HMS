// backend/config/database.js
const { Sequelize } = require('sequelize'); // Importing Sequelize

const sequelize = new Sequelize(
  process.env.DATABASE || 'hms', // Database name
  process.env.USER || 'root',    // MySQL user
  process.env.PASSWORD || '',    // MySQL password
  {
    host: process.env.HOST || 'localhost', // Host
    dialect: 'mysql',                       // Use MySQL
    port: process.env.DB_PORT || 3306,     // MySQL port
  }
);
``
module.exports = sequelize; // Export Sequelize instance for use in other files
