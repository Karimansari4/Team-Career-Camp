const express = require('express')
const { signup, signin } = require('../Controllers/EmployeeController')
const empRouter = express.Router()


empRouter.post('/signUp', signup)

empRouter.post('/signIn', signin)


module.exports = empRouter