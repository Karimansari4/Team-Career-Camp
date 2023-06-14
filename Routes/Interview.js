const express = require('express')
const { getAllInterviews, createInterview, enrollInInterview, deallocateInterview, deleteCompany } = require('../Controllers/Interview')
const intRoute = express.Router()

intRoute.get('/getAllInterviews', getAllInterviews)

intRoute.post('/createInterivew', createInterview)

intRoute.post('/enrolledInterview/:id', enrollInInterview)

intRoute.post('/deallocateInterview/:studentId/:interviewId', deallocateInterview)

intRoute.delete('/deleteCompany/:id', deleteCompany)

module.exports = intRoute