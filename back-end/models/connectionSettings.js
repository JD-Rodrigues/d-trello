const mariadb = require('mariadb/callback');


const conn = mariadb.createConnection({
  host: "containers-us-west-176.railway.app",
  user: "root", 
  password: "MH3JQfAuj3RVqLJK4gix",
  database: "railway",
  pipelining:true,
});

// const conn = mariadb.createConnection({
//   host: "localhost",
//   user: "root", 
//   password: "ephesius212",
//   database: "d_trello",
//   pipelining:true,
// });

module.exports = {conn}