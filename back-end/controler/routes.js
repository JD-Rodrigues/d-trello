const express = require('express')
const { read, create, update, remove } = require('../models/queries')



const router = express.Router()


router.get('/boards/:code', async (req, res)=> {
  const code = req.params.code
  const data = await read('boards',code)
  res.json(data)
})

router.get('/tasks/:code', async (req, res)=> {
  const code = req.params.code
  const data = await read('tasks',code)
  res.json(data)
})

router.get('/users/:code', async (req, res)=> {
  const code = req.params.code
  const data = await read('users',code)
  res.json(data)
})

router.post('/boards', async (req, res)=> {
  await create('boards', req.body.data )
  res.send(`status: ${res.statusMessage}`)
})

router.post('/tasks', async (req, res)=> {
  await create('tasks', req.body.data )
  res.send(`status: ${res.statusCode}`)  
})

router.post('/users', async (req, res)=> {
  await create('users', req.body.data )
  res.send(`status: ${res.statusMessage}`)
})

router.put('/boards/:id', async (req, res)=> {
  await update('boards', req.params.id, req.body.data )
  res.send(`status: ${res.statusMessage}`)
})

router.put('/tasks/:id', async (req, res)=> {
  await update('tasks', req.params.id, req.body.data )
  res.send(`status: ${res.statusMessage}`)
})

router.delete('/boards/:id', async (req, res)=> {
  remove('boards', req.params.id )
  res.send(`status: ${res.statusMessage}`)
})

router.delete('/tasks/:id', async (req, res)=> {
  await remove('tasks', req.params.id )
  res.send(`status: ${res.statusMessage}`)
})



module.exports = router