const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

module.exports = (connect) = async(req, res) => {
    try {
        const response = await mongoose.connect(process.env.ATLAS_URL)
        console.log("Database Connected Successfully.");
    } catch (error) {
        console.log("Mongoose Connection Error: ", error);
    }
}