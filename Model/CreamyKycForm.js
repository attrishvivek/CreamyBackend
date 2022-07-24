var mongoose = require('mongoose');


const KycForm = mongoose.Schema(
    {
        userProfile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },

        firstName: {
            type: String,

        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
        },
        phoneNumber: {
            type: String
        },
        telegramUser: {
            type: String
        },
        address: {
            type: String
        },
        OptionAddress: {
            type: String
        },
        city: {
            type: String
        },
        State: {
            type: String
        },
        DOB: {
            type: Date
        },
        Nationality: {
            type: String
        },
        zipcode: {
            type: String
        },
        uploads: {
            type: Array,
            default: ''
        },
        documenttype: {
            type: String
        },
        wallet: {
            type: String
        },
        tokenAddress: {
            type: String
        },
        KycForm: {
            type: Boolean,
            default: false
        },
        KycFormstatus: {
            type: String,
            enum: ['Accepted', 'Rejected', 'Pending', "Missing", "Update"],
            default: 'Pending'

        },
        KycFormadmindate: {
            type: Date
        },
        Verification: {
            type: Boolean,
            default: false
        }

    }, { timestamps: true }
)




module.exports = mongoose.model('KycForm', KycForm);

