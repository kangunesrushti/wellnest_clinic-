const express = require('express')
const app = express()

const webrouter = require('./routes/website')
const adminrouter = require('./routes/admin')
app.set('view engine', 'ejs');
app.use(express.static('public'))

app.use('/',webrouter);
app.use('/admin',adminrouter)



app.listen(3000)