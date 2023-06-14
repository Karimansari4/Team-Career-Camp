const express = require('express')
const { downloadCSVReport } = require('../Controllers/Report')
const reportRoute = express.Router()

reportRoute.get('/getAllReport', downloadCSVReport)

module.exports = reportRoute