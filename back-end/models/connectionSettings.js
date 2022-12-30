const mysql = require('mysql2/promise');


// host freehostia.com
// const connection = async () => {
//   const connection = await mysql.createConnection("mysql://josrod366_dtrello:ephesius212@mysql.freehostia.com:3306/josrod366_dtrello"); 
//   console.log('Conectou ao mysql')
//   return connection
// }


// host Railway
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