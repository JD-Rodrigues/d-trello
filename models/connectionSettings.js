const mariadb = require('mariadb/callback');


const conn = mariadb.createConnection({
  host: "localhost",
  user: "root", 
  password: "ephesius212",
  database: "d_trello",
  pipelining:true,
});

module.exports = {conn}