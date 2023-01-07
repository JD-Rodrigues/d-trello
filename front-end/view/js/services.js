const createData = async (route, data) => {
  
  await fetch(`https://d-trello.onrender.com/${route}/`, 
  {
    headers: {"Content-type": "application/json; charset=UTF-8"},
    method: "POST",
    body:JSON.stringify({
      data: data
    })
  })
}

const readData = async (route, userCode) => {
  const res = await fetch(`https://d-trello.onrender.com/${route}/${userCode}`);
  return res.json()
}

const updateData = async (route, id, data) => {
  await fetch(`https://d-trello.onrender.com/${route}/${id}`, 
  {
    headers: {"Content-type": "application/json; charset=UTF-8"},
    method: "PUT",
    body:JSON.stringify({
      data: data
    })
  })
}

const deleteData = async (route, id) => {
  await fetch(`https://d-trello.onrender.com/${route}/${id}`,
  {
    method: "DELETE"
  })
}




