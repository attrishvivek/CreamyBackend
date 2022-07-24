const mongoose = require('mongoose')

const ProfileDetails = new mongoose.Schema(
    {
        userId: {
            type: String
        },
        legalName: {
            type: String
        },
        DOB: {
            type: Date
        },
        streetAddress: {
            type: String
        },
        alternativeAddress: {
            type: String
        },
        useMambaSea: {
            type: String
        },
        town: {
            type: String
        },

        State: {
            type: String
        },
        PostCode: {
            type: Number
        },
        Employment: {
            type: String
        },
        fundSource: {
            type: String
        },


    }, { timestamps: true }
);

module.exports = mongoose.model('ProfileDetails', ProfileDetails);