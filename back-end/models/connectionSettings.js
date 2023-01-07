const mysql = require('mysql2/promise');


// host Railway
const connection = async () => {
  const connection = await mysql.createConnection("mysql://root:MH3JQfAuj3RVqLJK4gix@containers-us-west-176.railway.app:7843/railway"); 
  console.log('Conectou ao mysql')
  return connection
}


module.exports = {connection}