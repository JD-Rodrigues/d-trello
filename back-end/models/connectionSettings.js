const mysql = require('mysql2/promise');


const connection = async () => {
  const connection = await mysql.createConnection("mysql://root:MH3JQfAuj3RVqLJK4gix@containers-us-west-176.railway.app:7843/railway"); 
  console.log('Conectou ao mysql')
  return connection
}




// const conn = mariadb.createConnection({
//   host: "localhost",
//   user: "root", 
//   password: "ephesius212",
//   database: "d_trello",
//   pipelining:true,
// });

module.exports = {connection}