const { conn } = require("./connectionSettings");

const create = (table, info) => {
  let columns; 
  let howMuchValues;
  const infoValues = Object.values(info)
  const infoKeys = Object.keys(info)

  infoKeys.forEach((key, index)=>{
    switch (index) {
      case 0:
        columns = `${key}, `;
        break;
      case infoKeys.length - 1:
        columns += `${key}`;
        break;
      default:
        columns += `${key}, `;
    }
  })

  infoValues.forEach((value, index)=>{
    switch (index) {
      case 0:
        howMuchValues = `?, `;
        break;
      case infoValues.length - 1:
        howMuchValues += `?`;
        break;
      default:
        howMuchValues += `?, `;
    }
  })

  conn.beginTransaction(error=> {
    if(error) {
      console.log(`Error in starting a transaction: ${error}`)
    } else {
      console.log('Conexion started!')
    }
  });

  try {
    conn.query(`INSERT INTO d_trello.${table} (${columns}) VALUES (${howMuchValues})`, infoValues, (err, result)=> {
      if(err) throw err;
      console.log(result)
    })
    
  } catch(err) {
    console.log(err);
    conn.rollback(error => {
      if (error) {
         console.log("SQL error in rolling back a transaction: ", error);
      }
   });
  }

  conn.commit(err => {
    if(err) console.log(err);
  })

}

const read = table => {
  conn.beginTransaction(error=> {
    if(error) {
      console.log(`Error in starting a transaction: ${error}`)
    } else {
      console.log('Conexion started!')
    }
  });

  return new Promise ((resolve, reject) => {
    try {
      conn.query(
        `SELECT * FROM d_trello.${table}`,
        (err,res,meta) => {
           if (err) {
              console.error("Error querying data: ", err);
           } else {
              resolve(res)
           }
        }
     );
    } catch(error) {
      if (error) console.log(error);
      conn.rollback(error => {
        if (error) {
           console.log("SQL error in rolling back a transaction: ", error);
        }
     });
    }
  
    conn.commit(err => {
      if(err) console.log(err);
    })
  })
}

const update = (table, id, info) => {
  conn.beginTransaction(error=> {
    if(error) {
      console.log(`Error in starting a transaction: ${error}`)
    } else {
      console.log('Conexion started!')
    }
  });

  try {
    const keys = Object.keys(info)
    const values = Object.values(info)
    let columns;
    keys.forEach((key,index)=> {
      switch (index) {
        case 0:
          columns = `${key} = ?, `;
          break;
        case keys.length - 1:
          columns += `${key} = ?`;
          break;
        default:
          columns += `${key} = ?, `
      }
    })
    // const query = `UPDATE people2.contacts3 SET ${columns} WHERE id = ${id}`
    conn.query(`UPDATE d_trello.${table} SET ${columns} WHERE id = ${id}`, values, (err, res, meta) => {
      if(err) {
        console.log(err)
      } else {
        console.log(res)
        console.log(meta)
        
      }
    })
  } catch(error) {
    if (error) console.log(error);
    conn.rollback(error => {
      if (error) {
         console.log("SQL error in rolling back a transaction: ", error);
      }
   });
  }

  conn.commit(err => {
    if(err) console.log(err);
  })
}

const remove = (table, id) => {
  conn.beginTransaction(error=> {
    if(error) {
      console.log(`Error in starting a transaction: ${error}`)
    } else {
      console.log('Conexion started!')
    }
  });

  try {
    conn.query(`DELETE FROM d_trello.${table} WHERE id = ?`, [id], (err, res, meta) => {
      if(err) {
        console.log(err)
      } else {
        console.log(res)
        console.log(meta)
        
      }
    })
  } catch(error) {
    if (error) console.log(error);
    conn.rollback(error => {
      if (error) {
         console.log("SQL error in rolling back a transaction: ", error);
      }
   });
  }

  conn.commit(err => {
    if(err) console.log(err);
  })
}

// create('tasks', {title: 'tomar água', board_id:1, task_order:4})
module.exports = {create, read, update, remove}