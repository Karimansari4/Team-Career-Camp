const Interviews = require('../Models/Interviews')
const Students = require('../Models/Students')
const nodemailer = require('nodemailer')

exports.getAllInterviews = async(req, res) => {
    try {
        const result = await Interviews.find({}).populate('students.student')
        if(result){
            return res.status(200).json({result, success: true})
        }else{
            return res.status(400).json({msg: `No Data Found?`, success: false})
        }
    } catch (error) {
        console.log("error on getAllInterviews: ", error);
        return res.status(500).json({err: error.message, error, success: false})
    }
}

exports.createInterview = async(req, res) => {
    const { name, date, time} = req.body

    try {
        if(!name){
            return res.status(400).json({msg: 'Please enter company name?', success: false})
        }else if(!date){
            return res.status(400).json({msg: 'Please enter interview date?', success: false})
        }else if(!time){
            return res.status(400).json({msg: 'Please enter interview time?', success: false})
        }else{
            const result = await Interviews.create({companyName: name, date: date, time: time})
            if(result){
                return res.status(200).json({msg: `Interview ${result.companyName} added successfully.`, success: true}) 
            }else{
                return res.status(200).json({msg: `Falied to add ${name}?`, success: false})
            }
        }
    } catch (error) {
        console.log("error on createInterview: ", error);
        return res.status(500).json({err: error.message, error, success: false})
    }
}

exports.enrollInInterview = async(req, res) => {
    const id = req.params.id
    const { email, result } = req.body
    
    try {
        
        let interview = await Interviews.findById(id) 
        
        if(interview){

            const student = await Students.findOne({email: email})
            
            if(student){

                const alreadyEnrolled = await Interviews.findOne({"students.student": student._id})

                if(alreadyEnrolled){
                    
                    for(let i of student.interviews){
                        if(i.company === interview.companyName){
                            return res.status(400).json({msg: `${student.name} already enterolled in ${interview.companyName} interivew!`, success: true})
                        }else{
                            console.log("run");
                        }
                    }
                    
                    if(alreadyEnrolled.companyName === interview.companyName){
                        return res.status(400).json({msg: `${student.name} already enterolled in ${interview.companyName} interivew!`, success: true})
                    }else{
                        let studentObj = { student: student._id, result: result}
                        const scheduleInterivew = await interview.updateOne({$push: {students: studentObj}})
                        
                        const assignedSuccess = await student.updateOne({$push: {interviews: {company: interview.companyName, date: interview.date, time: interview.time, result: result}}})
                        
                        if(scheduleInterivew && assignedSuccess){

                            // creating mail servies

                            let transporter = nodemailer.createTransport({
                                service: 'gmail',
                                host: "smtp.gmail.com",
                                port: 587,
                                secure: false,
                                auth: {
                                    user: "goprahul545@gmail.com",
                                    pass: "zdoqxecvhrdhdybv",
                                },
                                tls: {
                                  // do not fail on invalid certs
                                  rejectUnauthorized: false,
                                },
                            })

                            let info = await transporter.sendMail({
                                from: 'goprahul545@gmail.com',
                                to: email,
                                subject: "B.A. College of Engineering and Technology Placement",
                                text: `Hi ${student.name}`,
                                html: `Hi ${student.name} </br> Interivew Schedule with ${interview.companyName} on ${interview.date} and interview start time is ${interview.time} </br> Please arrived college before time </br> regards college campus`,
                            })                            
                            return res.status(200).json({msg: `${student.name} enrolled in ${interview.companyName} interview!`, success: true, info})
                        }else{
                            return res.status(400).json({msg: `Failed to schedul ${student.name} interview with ${interview.companyName}?`, success: false})
                        }
                    }

                }else{
                    let studentObj = { student: student._id, result: result}
                    const scheduleInterivew = await interview.updateOne({$push: {students: studentObj}})
                    
                    const assignedSuccess = await student.updateOne({$push: {interviews: {company: interview.companyName, date: interview.date, time: interview.time, result: result}}})
                    
                    if(scheduleInterivew && assignedSuccess){
                        // creating mail servies

                        let transporter = nodemailer.createTransport({
                            service: 'gmail',
                            host: "smtp.gmail.com",
                            port: 587,
                            secure: false,
                            auth: {
                                user: "goprahul545@gmail.com",
                                pass: "zdoqxecvhrdhdybv",
                            },
                            tls: {
                              // do not fail on invalid certs
                              rejectUnauthorized: false,
                            },
                        })

                        let info = await transporter.sendMail({
                            from: 'goprahul545@gmail.com',
                            to: email,
                            subject: "B.A. College of Engineering and Technology Placement",
                            text: `Hi ${student.name}`,
                            html: `Hi ${student.name} </br> Interivew Schedule with ${interview.companyName} on ${interview.date} and interview start time is ${interview.time} </br> Please arrived college before time </br> regards college campus`,
                        })
                        return res.status(200).json({msg: `${student.name} enrolled in ${interview.companyName} interview!`, success: true, info})
                    }else{
                        return res.status(400).json({msg: `Failed to schedul ${student.name} interview with ${interview.companyName}?`, success: false})
                    }
                }
            }
        }  
    } catch (error) {
        console.log("error on enrollInInterview: ", error);
        return res.status(500).json({err: error.message, error, success: false})
    }
}

exports.deallocateInterview = async(req, res) => {
    const { studentId, interviewId} = req.params

    try {
        const interview = await Interviews.findById(interviewId)
        if(interview){
            const deletingInterview = await Interviews.findOneAndUpdate(
                {_id: interviewId},
                {$pull: {students: {student: studentId}}}
            )

            const deletingStudent = await Students.findOneAndUpdate(
                {_id: studentId},
                {$pull: {interviews: {company: deletingInterview.companyName}}}
            )
            if(deletingInterview && deletingStudent){
                return res.status(200).json({msg: `${deletingStudent.name} interview with ${deletingInterview.companyName} deleted successfully`, success: true})
            }else{
                return res.status(400).json({msg: `Failed to delete ${deletingStudent.name} interview with ${deletingInterview.companyName}? `, success: false})
            }
        }
    } catch (error) {
        console.log("error on deallocateInterview: ", error);
        return res.status(500).json({err: error.message, error, success: false})
    }
}

exports.deleteCompany = async(req, res) => {
    const id = req.params.id

    try {
        
        const findCompany = await Interviews.findById(id)
        if(findCompany){
            if(findCompany.students.length > 0){
                return res.status(400).json({msg: `Can not delete ${findCompany.companyName}? because interview scheduled with students`, success: false})
            }else{
                const result = await Interviews.findByIdAndDelete(id)
                if(result){
                    return res.status(200).json({msg: `${findCompany.companyName} deleted successfully.`, success: true})
                }else{
                    return res.status(400).json({msg: `${findCompany.companyName} failed to delete?`})
                }
            }
        }else{
            return res.status(404).json({msg: `No data found?`})
        }
         
    } catch (error) {
        console.log("error on deleteCompany: ", error);
        return res.status(500).json({err: error.message, error, success: false})
    }
}