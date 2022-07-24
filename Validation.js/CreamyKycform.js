const { Timestamp } = require("bson")

const validate = (admin) => {
    error = {}
    if (!admin.firstName) {
        error.firstName = "Please select a Name"
    }
    if (!admin.lastName) {
        error.lastName = "Please select a FullName"
    }
    if (!admin.email) {
        error.email = "Please select a email"
    }
    if (!admin.phoneNumber) {
        error.phoneNumber = "Please select a phoneNumber"
    }
    // if (!admin.telegramUser) {
    //     error.telegramUser = "Please select a telegramUser"
    // }
    // if (!admin.OptionAddress) {
    //     error.OptionAddress = "Please select a OptionAddress"
    // }
    if (!admin.address) {
        error.address = "Please select a OptionAddress"
    }
    if (!admin.city) {
        error.city = "Please select a city"
    }
    if (!admin.State) {
        error.State = "Please select a State"
    }
    if (!admin.DOB) {
        error.DOB = "Please select a State"
    }
    if (!admin.Nationality) {
        error.Nationality = "Please select a Nationality"
    } if (!admin.zipcode) {
        error.zipcode = "Please select a zipcode"
    }
    // if (!admin.document) {
    //     error.document = "Please select a document"
    // }
    // if (!admin.wallet) {
    //     error.wallet = "Please select a wallet"
    // }
    // if (!admin.tokenAddress) {
    //     error.tokenAddress = "Please select a tokenAddress"
    // }

    return {
        error,
        isValid: Object.keys(error).length === 0
    }

}
module.exports = validate