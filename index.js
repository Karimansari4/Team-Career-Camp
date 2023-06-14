const express = require('express')
const app = express()
const cors = require('cors')
const db = require('./DBConfig/db')
const empRouter = require('./Routes/EmployeesRoute')
const stRoute = require('./Routes/Student')
const intRoute = require('./Routes/Interview')
const port = 4000
const path = require('path')

// express body-parser and cors policy
app.use(express.json())
app.use(cors())

// db connction
db()

app.use(express.static(path.join(__dirname, "build")))


// route to render build react app
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"))
})


// routes of functions
app.use('/empAuth', empRouter)
app.use('/student', stRoute)
app.use('/interview', intRoute)

// running server in port
app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})