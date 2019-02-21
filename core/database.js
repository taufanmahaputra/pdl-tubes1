const Sequelize = require('sequelize');

const sequelizeClient = new Sequelize('postgres://localhost:5432/pdl_schema');

sequelizeClient
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = {
  sequelizeClient
}