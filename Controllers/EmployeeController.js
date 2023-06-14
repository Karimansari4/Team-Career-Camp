const Employees = require('../Models/Employees')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()
const salt = process.env.SALT
const secret = process.env.SECRET

// there is a but to create a token data is not converting in to jwt token missing
const createToken = (result) => {
    // console.log("result: token", result);
    return jwt.sign({result}, secret, {expiresIn: '30d'})
}


exports.signup = async(req, res) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    try {
        if(!name){
            return res.status(400).json({msg: 'Please enter name', success: false})
        }else if(!email){
            return res.status(400).json({msg: 'Please enter email', success: false})
        }else if(!password){
            return res.status(400).json({msg: 'Please enter password', success: false})
        }else if(password.length > 5){
            return res.status(400).json({msg: 'Password must be more than 5 words', success: false})
        }else{
            
            const hashedPass = await bcrypt.hash(password, parseInt(salt))

            const employees = new Employees({name: name, email: email, password: hashedPass})
            const result = await employees.save()
            if(result){
                // const data = {name: result.name, email: result.email}
                const token = createToken({_id: result._id, name: result.name, email: result.email})
                if(token){
                    return res.status(200).json({token, success: true})
                }else{
                    console.log("failed to generate token");
                }
            }else{
                console.log("falied to save result", result);
                return res.status(400).json({msg: 'Something went wrong!', success: false})
            }
        }
    } catch (error) {
        console.log("signup error: ", error);
        return res.status(500).json({msg: error.message, error})
    }
}

exports.signin = async(req, res) => {
    const email = req.body.email
    const password = req.body.password

    try {
        if(!email){
            return res.status(400).json({msg: 'Please enter email', success: false})
        }else if(!password){
            return res.status(400).json({msg: 'Please enter password', success: false})
        }else if(password.length < 5){
            return res.status(400).json({msg: 'Password must be more than 5 words', success: false})
        }else{
            const findEmp = await Employees.findOne({email: email})
            if(findEmp){
                const matchPass = await bcrypt.compare(password, findEmp.password)
                if(matchPass){
                    const token = createToken({_id: findEmp._id, name: findEmp.name, email: findEmp.email})
                    return res.status(200).json({token, success: true})
                }else{
                    return res.status(400).json({msg: 'email or password are incorrect!', success: false})
                }
            }else{
                return res.status(400).json({msg: 'email or password are incorrect!', success: false})
            }
        }
    } catch (error) {
        console.log("signin error: ", error);
        return res.status(500).json({msg: error.message, error})
    }
}