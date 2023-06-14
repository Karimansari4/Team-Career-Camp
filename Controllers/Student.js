const Students = require('../Models/Students')
const Interviews = require('../Models/Interviews')


module.exports.getStudents = async(req, res) => {

    try {

        const result = await Students.find({}).populate('interviews')
        // const result = await Students.find()
        if(result){
            return res.status(200).json({result, success: true})
        }else{
            return res.status(404).json({msg: 'No Data Found?'})
        }
        
    } catch (error) {
        console.log("error on getStudents: ", error);
        return res.status(500).json({err: error.message, error, success: false})
    }
}

exports.getById = async(req, res) => {
    const id = req.params.id

    try {
        if(!id){
            return res.status(400).json({msg: 'Access Denied?', success: false})
        }else{
            const result = await Students.findById(id)
            if(result){
                return res.status(200).json({msg: 'ok', result, success: true})
            }else{
                return res.status(400).json({msg: "No Data found?", success: false})
            }
        }
    } catch (error) {
        console.log("error on getById: ", error);
        return res.status(500).json({err: error.message, error, success: false})
    }
}

exports.addStudent = async(req, res) => {
    const {name, email, batch, college, placementStatus, dsaScore, reactScore, webDScore} = req.body

    try {

        if(!name){
            return res.status(400).json({msg: 'Please enter name?', success: false})
        }else if(!email){
            return res.status(400).json({msg: 'Please enter email?', success: false})
        }else if(!batch){
            return res.status(400).json({msg: 'Please enter batch name?', success: false})
        }else if(!college){
            return res.status(400).json({msg: 'Please enter college name?', success: false})
        }else if(!placementStatus){
            return res.status(400).json({msg: 'Please enter placement status?', success: false})
        }else if(!dsaScore){
            return res.status(400).json({msg: 'Please enter DSA score?', success: false})
        }else if(!reactScore){
            return res.status(400).json({msg: 'Please enter React score?', success: false})
        }else if(!webDScore){
            return res.status(400).json({msg: 'Please enter Web Dev score?', success: false})
        }else{
            const checkStudent = await Students.findOne({email: email})
            if(checkStudent){
                return res.status(400).json({msg: `Student ${name} is already added`})
            }else{
                const result = await Students.create({name: name, email: email, college: college, batch: batch, status: placementStatus, dsaScore: dsaScore, reactScore: reactScore, webDScore: webDScore})
                if(result){
                    return res.status(200).json({msg: `Student ${result.name} addedd successfully.`, success: true})
                }else{
                    return res.status(400).json({msg: 'Opps! something went wrong?', success: false})
                }
            }
        }
        
    } catch (error) {
        console.log("error on addStudent: ", error);
        return res.status(500).json({err: error.message, error, success: false})
    }
}

exports.updateStudent = async(req, res) => {
    const id = req.params.id
    const { name, email, college, batch, dsaScore, reactScore, webDScore, placementStatus } = req.body

    try {

        const checkStudent = await Students.findById(id)
        if(checkStudent){
            const result = await Students.findByIdAndUpdate({_id: id}, {name: name, email: email, college: college, batch: batch, dsaScore: dsaScore, reactScore: reactScore, webDScore: webDScore, status: placementStatus})
            if(result){
                return res.status(200).json({msg: `Student ${result.name} has been updated successfully.`, success: true})
            }else{
                return res.status(400).json({msg: `Failed to update ${result.name}?`})
            }
        }else{
            return res.status(404).json({msg: `Student ${name} not found?`, success: false})
        }
        
    } catch (error) {
        console.log("error on updateStudent: ", error);
        return res.status(500).json({err: error.message, error, success: false})
    }
}

exports.deleteStudent = async(req, res) => {
    const id = req.params.id
    
    try {

        const findStudent = await Students.findById({_id: id})

        if(findStudent){

            const interviewsOfStudent = findStudent.interviews

            if(interviewsOfStudent.length > 0){
                
                for(let interview of interviewsOfStudent){
                    await Interviews.findOneAndUpdate({companyName: interview.company}, {$pull: {Students: {student: id}}})
                }
                const result = await Students.findByIdAndDelete({_id: id})
                if(result){
                    return res.status(200).json({msg: `Student ${result.name} deleted successfully.`, success: true})
                }else{
                    return res.status(400).json({msg: `Failed to Delete ${result.name}?`})
                }
            }else{
                const result = await Students.findByIdAndDelete(id)
                if(result){
                    return res.status(200).json({msg: `${findStudent.name} is deleted successfully.`, success: true})
                }else{
                    return res.status(400).json({msg: `${findStudent.name} failed to delete?`, success: false})
                }
            }
        }
        
    } catch (error) {
        console.log("error on deleteStudent: ", error);
        return res.status(500).json({err: error.message, error, success: false})
    }
}