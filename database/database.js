const Sequelize = require('sequelize');
const connection = new Sequelize('guiaperguntas', 'root', '15251413', {
    host: 'localhost',
    dialect: 'mysql',
    
});

module.exports = connection; 

// Solução para erro Mysql: ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '15251413'
// Modificar codigo pelo terminal Ubuntu = nano codigo.js
// Solução sequelize: trabalhar com a versão 5.7 do MySql