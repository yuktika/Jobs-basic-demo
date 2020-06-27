const mongoose = require('mongoose')

const JobSchema = mongoose.Schema({
    rname: {
        type: String
    },
    rmail: {
        type: String
    },
    jobtitle: {
        type: String
    },
    jobdescription: {
        type: String
    },
    companyname: {
        type: String
    },
    companylocation: {
        type: String
    }
})

const Jobpost = module.exports = mongoose.model('Jobpost', JobSchema)