const mongoose = require('mongoose')

const ApplySchema = mongoose.Schema({
    jobid: {
        type: String,
        required: true,
    },
    uid: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    created_on: {
        type: String,
        required: true,
    }
})
const Apply = module.exports = mongoose.model('Apply', ApplySchema)