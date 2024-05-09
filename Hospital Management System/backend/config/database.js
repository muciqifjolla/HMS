const { Sequelize } = require('sequelize');

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

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

module.exports = sequelize;
