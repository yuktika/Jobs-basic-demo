const mongoose = require('mongoose')
const findOrCreate = require('mongoose-find-or-create')
const UserSchema = mongoose.Schema({
    id: {
        type: String,
        // required: true,
    },
    name: {
        type: String
        // required: true,
    },
    email: {
        type: String
        // required: true,
    },
    username: {
        type: String
        // required: true,
    },
    password: {
        type: String
        // required: true,
    },
    dob: {
        type: String
        // required: true,
    },
    country: {
        type: String
        // required: true,
    },
    city: {
        type: String
        // required: true,
    },
    position: {
        type: String
        // required: true,
    },
    jobtitle: {
        type: String
        // required: true,
    },
    // resume: {
    // type: String
    // required: true,
    // }
})
// UserSchema.plugin(findOrCreate)

const Task = module.exports = mongoose.model('Users', UserSchema)