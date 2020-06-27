const mongoose = require('mongoose')

const JobseekerSchema = mongoose.Schema({
    name: {
        type: String,
        // required: true,
    },
    jobtitle: {
        type: String,
        // required: true,
    },
    companylocation: {
        type: String,
        // required: true,
    },
    resume: {
        type: String,
        // required: true,
    }
})

const Jobseeker = module.exports = mongoose.model('jobseeker', JobseekerSchema)