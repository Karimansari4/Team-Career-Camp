const fs = require("fs");
const path = require("path");
const Student = require('../Models/Students')

module.exports.downloadCSVReport = async function (req, res) {
  try {
    const allStudents = await Student.find({});
    let report =
      "student Id, Student name,Student college, Student email, Student status, DSA Final Score, WebD Final Score, React Final Score, Interview date, Interview company, Interview result";
    let studentData1 = "";

    for (let student of allStudents) {
      studentData1 =
        student._id +
        "," +
        student.name +
        "," +
        student.college +
        "," +
        student.email +
        "," +
        student.status +
        "," +
        student.dsaScore +
        "," +
        student.webDScore +
        "," +
        student.reactScore;
      if (student.interviews.length > 0) {
        for (let interview of student.interviews) {
          let studentData2 = "";
          studentData2 +=
            "," +
            interview.date.toString() +
            "," +
            interview.company +
            "," +
            interview.result;
          report += "\n" + studentData1 + studentData2;
        }
      }
    }
    const url = path.join(__dirname, '../uploads')
    console.log("url: ", url);
    const csvFile = fs.writeFile(
      `${url}/StudentReport${Date()}.csv`,
      report,
      function (err, data) {
        if (err) {
          console.log("error on if", err);
          return res.status(400).json({msg: 'Something went wrong?', success: false})
        }
        return res.status(200).json({msg: 'Report downloaded successfully', success: true, result: csvFile, data});
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({err: err.message, error: err, success: false})
  }
};
