const createData = async (route, data) => {
  await fetch(`http://localhost:3001/${route}/`, 
  {
    headers: {"Content-type": "application/json; charset=UTF-8"},
    method: "POST",
    body:JSON.stringify({
      data: data
    })
  })
}

const readData = async (route) => {
  const res = await fetch(`http://localhost:3001/${route}`);
  return res.json()
}

const updateData = async (route, id, data) => {
  await fetch(`http://localhost:3001/${route}/${id}`, 
  {
    headers: {"Content-type": "application/json; charset=UTF-8"},
    method: "PUT",
    body:JSON.stringify({
      data: data
    })
  })
}

const deleteData = async (route, id) => {
  await fetch(`http://localhost:3001/${route}/${id}`,
  {
    method: "DELETE"
  })
}

// createData('tasks', {title: "Checar e-mails", board_id:1, task_order: 9})
// createData('boards', {title: "Feito <i class='ph-pencil-fill'></i>", board_order:3, class:'default'})
// updateData('boards', 24, {class: "success"})
// deleteData('boards', 25)
// readData('boards').then(data=>console.log(data))

