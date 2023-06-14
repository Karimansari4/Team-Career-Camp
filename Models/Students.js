const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StudentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    college: {
        type: String,
        required: true
    },
    batch: {
        type: String,
        required: true
    },
    dsaScore: {
        type: Number,
        required: true
    },
    webDScore: {
        type: Number,
        required: true
    },
    reactScore: {
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum: ["Placed", "Not Placed"],
        required: true
    },
    interviews: [{
        company: {
            type: String,
            required: true
        },
        date: {
            type: String,
            reqruied: true
        },
        time: {
            type: String,
            required: true
        },
        result: {
            type: String,
            enum: ["PASS", "FAIL", "On Hold", "Didn't Attempt"]
        }
    }],
    
},{timestamps: true})

const Students = mongoose.model('student', StudentSchema)
module.exports = Students