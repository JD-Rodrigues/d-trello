const { default: axios } = require("axios")

const createData = async (route, data) => {
  await axios.post(`http://localhost:3001/${route}`, {data:data})
}

const readData = async (route) => {
  const res = await axios.get(`http://localhost:3001/${route}`);
  return res
}

const updateData = async (route, id, data) => {
  await axios.put(`http://localhost:3001/${route}/${id}`, {data:data})
}

const deleteData = async (route, id) => {
  await axios.delete(`http://localhost:3001/${route}/${id}`)
}

createData('tasks', {title: "Checar e-mails", board_id:1, task_order: 9})
// updateData('tasks', 10, {title: "Tomar café"})
// deleteData('tasks', 13)
