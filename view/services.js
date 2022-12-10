const { default: axios } = require("axios")

const getData = async () => {
  console.log('Opa!')
  const res = await axios.get('http://localhost:3001/tasks');
  return res
}

getData().then(console.log)