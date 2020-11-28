const express = require('express')

const mongoose = require('./db/mongoose')
const { ObjectID } = require('mongodb')

const app = express()
const port = process.env.PORT || 3000

const routerUser = require('./routers/user')
const routerTask = require('./routers/task')
const auth = require('./middleware/auth')


//Goal: setup middleware function maintenance Mode
// const maintenanceMode = (req, res, next) => {
//     res.status(503).send('Site is current off. Please check again!')
// }
// app.use(maintenanceMode)
app.use(express.json())
app.use([routerUser, routerTask])
app.use(auth)

app.listen(port, () => {
    console.log('Server is up on port' + port)
})