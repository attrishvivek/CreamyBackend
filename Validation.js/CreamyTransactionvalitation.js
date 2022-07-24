const { Timestamp } = require("bson")
// const { orderID, mambaToken, ethAmount, maticAmount, usdAmount, transactionHash, transactionStats } = req.body
const validate = (admin) => {
    error = {}

    // if (!admin.usdCrrentAmount) {
    //     error.usdCrrentAmount = "Yor Are Missed usdCrrentAmount"
    // }
    // if (!admin.mambaToken) {
    //     error.mambaToken = "Yor Are Missed mambaToken"
    // }
    // if (!admin.ethAmount) {
    //     error.ethAmount = "Yor Are Missed ethAmount"
    // }
    // if (!admin.maticAmount) {
    //     error.maticAmount = "Yor Are Missed maticAmount"
    // }
    // if (!admin.usdAmount) {
    //     error.usdAmount = "Yor Are Missed usdAmount"
    // }
    // if (!admin.transactionHash) {
    //     error.transactionHash = "Yor Are Missed transactionHash"
    // }
    // if (!admin.transactionStats) {
    //     error.transactionStats = "Yor Are Missed transactionStats"
    // }


    return {
        error,
        isValid: Object.keys(error).length === 0
    }

}
module.exports = validate