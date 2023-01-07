const { connection } = require("./connectionSettings");

// It receives a table name in the 1st parameter and an object in the 2nd parameter, containing columns and its values to create a new row in the table.

const create = async (table, info) => {
  let columns; 
  let howMuchValues;
  const infoValues = Object.values(info)
  const infoKeys = Object.keys(info)


  // It iterates over the keys of the object, concatenating each key in a string assigned to the variable "columns". The result seems like: "title, board_order, class"
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


// It iterates over the value of the object. To each value iterated it concatenates a question tag in a string assigned to the variable "howMuchValues". The result seems like: "?, ?, ?"
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


  // It get together value of the three variables (columns, howMuchValues and infoValues) in a query string. The resulting seems like: "INSERT INTO database.table (title, board_order, class) VALUES (?, ?, ?), ["To do", 3, "success"]"
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

//Inputs: a table name in the 1st parameter and a user code from Google Auth in the 2nd. 
// Outputs: an array of objects representing the table whose info match the arguments received by the function.
const read = async (table, code) => {  
    try {      
      const conn = await connection()
      const data = await conn.query(`SELECT * FROM ${table}  WHERE user_code = "${code}"`)
      return data[0]        
    } catch(error) {
      if (error) console.log(error);
    }  
}

// It updates a row. 
// Inputs: 1st - table name, 2nd - row id, 3rd - an object containing columns to be updated and the new values.
// The spreading of this info in the implementation seems "create" function explained above.
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

//It receives a table name and a row id and removes the row from the table.
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

module.exports = {create, read, update, remove}