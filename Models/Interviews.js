const mongoose = require('mongoose')
const Schema = mongoose.Schema

const InterviewSchema = new Schema({
    companyName: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    students: [
        {
            student: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'student'
            },
            result: {
                type: String,
                enum: ["Pass", "Fail", "Didn't Attempt", "On Hold"]
            }
        },
    ]
}, {timestamps: true})

const Interviews = mongoose.model('interview', InterviewSchema)
module.exports = Interviews