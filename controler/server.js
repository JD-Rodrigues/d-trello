const express = require('express');
const cors = require('cors');
const router = require('./routes')

// const router = express.Router()

//   router.get('/boards', async (req, res)=> {
//     const data = await read('boards')
//     res.json(data)
//   })


const app = express()

app.use(cors({origin: '*'}))
app.use(express.json())
app.use(router)

app.use(express.urlencoded({extended: true}))



app.listen(3001, ()=>console.log('Server ON'))

