const express = require('express')

const mongoose = require('./db/mongoose')
const { ObjectID } = require('mongodb')
require('dotenv').config({path: __dirname + '../config/dev.env'})

const app = express()
const port = process.env.PORT

const routerUser = require('./routers/user')
const routerTask = require('./routers/task')
const auth = require('./middleware/auth')
const multer = require('multer')
const chalk = require('chalk')

app.use(express.json())
app.use([routerUser, routerTask])
app.use(auth)

app.listen(port, () => {
    console.log('Server is up on port' + port)
})




