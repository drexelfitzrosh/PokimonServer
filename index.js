const express = require('express')
const mongoose = require('mongoose')
require('dotenv/config')
const bodyParser = require('body-parser')

//routes
const post = require('./routes/post')
const user = require('./routes/user')


//Main
const app = express()

app.use(bodyParser.json())

app.use('/pokemon', post)
app.use('/user', user)


app.get('/',(req,res)=>{
    res.send('hello world')
})

mongoose.connect( process.env.DB_CONNECTION ,{ useUnifiedTopology: true }, ()=> console.log('connected to db'))

app.listen(4000)