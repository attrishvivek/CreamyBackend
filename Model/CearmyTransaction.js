var mongoose = require('mongoose');


const transactionHistory = mongoose.Schema(
    {
        userProfile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },

        orderID: {
            type: Number,

        },
        mambaToken: {
            type: Number,
        },
        ethAmount: {
            type: Number,
        },
        maticAmount: {
            type: Number
        },
        usdAmount: {
            type: Number
        },
        transactionHash: {
            type: String
        },
        usdCrrentAmount: {
            type: Number
        },
        usdMaticCrrentAmount: {
            type: Number
        },
        senderID: {
            type: String
        },
        transactiontype: {
            type: String,
            enum: ['online', 'Manual', 'Referral'],
            default: 'online'
        },
        transactionadmindate: {
            type: Date
        },
        transactionStats: {
            type: String,
            enum: ['Accepted', 'Rejected', 'Pending'],
            default: 'Pending'
        },
        AdminTransactionHash: {
            type: String,
        },
        AdminTransactionWallet: {
            type: String
        }
    }, { timestamps: true }
)

module.exports = mongoose.model('transactionHistory', transactionHistory);

