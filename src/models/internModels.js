const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const internSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        // match: [/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/, 'Please fill a valid email address'],
        unique: true
    },

    mobile: {
        type: Number,
        required: true,
        // match: [/^([+]\d{2})?\d{10}$/, "please fill a valid mobile Number"],
        unique: true
    },
    collegeId: {
        type: ObjectId,
        ref: "college",
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

module.exports = mongoose.model('internModel',internSchema)
