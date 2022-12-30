const { connection } = require("./connectionSettings");

const create = async (table, info) => {
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

  try {
    const conn = await connection()
    await conn.query(`INSERT INTO railway.${table} (${columns}) VALUES (${howMuchValues})`, infoValues, (err, result)=> {
      if(err) throw err;
      console.log(result)
    })
    
  } catch(err) {
    console.log(err);
  }


}

const read = async (table, code) => {  
    try {      
      const conn = await connection()
      const data = await conn.query(`SELECT * FROM ${table}  WHERE user_code = "${code}"`)
      return data[0]        
    } catch(error) {
      if (error) console.log(error);
    }  
}

const update = async (table, id, info) => {
  try {
    const keys = Object.keys(info)
    const values = Object.values(info)
    let columns;
    if(keys.length === 1) {
      columns = `${keys[0]} = ?`
    } else {
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
    }
    
    // const query = `UPDATE people2.contacts3 SET ${columns} WHERE id = ${id}`
    const conn = await connection()
    await conn.query(`UPDATE railway.${table} SET ${columns} WHERE id = ${id}`, values, (err, res, meta) => {
      if(err) {
        console.log(err)
      } else {
        console.log(res)
        console.log(meta)
        
      }
    })
  } catch(error) {
    if (error) console.log(error);
  }

  
}

const remove = async (table, id) => {
  try {
    const conn = await connection()
    await conn.query(`DELETE FROM railway.${table} WHERE id = ?`, [id], (err, res, meta) => {
      if(err) {
        console.log(err)
      } else {
        console.log(res)
        console.log(meta)
        
      }
    })
  } catch(error) {
    if (error) console.log(error);
  }

  
}

// create('tasks', {title: 'tomar água', board_id:1, task_order:4})
// update('tasks', 15, {title: 'Fazer checklist do dia seguinte'})
// read('users', 'hsaduhauidahdi95').then(console.log)
module.exports = {create, read, update, remove}