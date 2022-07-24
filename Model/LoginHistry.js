const mongoose = require('mongoose')

const LoginHistory = new mongoose.Schema(
    {
        userId: {
            type: String
        },
        date: {
            type: Date,
            require: true,

        },
        Brower: {
            type: String,
            require: true
        },
        ip: {
            type: String,
            require: true
        },
        region: {
            type: String
        },
        Stateus: {
            type: String
        },


    }, { timestamps: true }
);

module.exports = mongoose.model('LoginHistory', LoginHistory);