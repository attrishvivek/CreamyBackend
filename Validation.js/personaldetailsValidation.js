const { Timestamp } = require("bson")

const validate = (admin) => {
    error = {}

    if (!admin.streetAddress) {
        error.streetAddress = "Please select a streetAddress"
    }
    if (!admin.town) {
        error.town = "Please select a town"
    }
    if (!admin.State) {
        error.State = "Please select a State"
    }
    if (!admin.PostCode) {
        error.PostCode = "Please select a PostCode"
    }
    if (!admin.fundSource) {
        error.fundSource = "Please select a fundSource"
    }
    if (!admin.Employment) {
        error.Employment = "Please select a Employment"
    }
    if (!admin.alternativeAddress) {
        error.alternativeAddress = "Please select a alternativeAddress"
    }
    if (!admin.useMambaSea) {
        error.useMambaSea = "Please select a useMambaSea"
    }
    if (!admin.DOB) {
        error.DOB = "Please select a DOB"
    }


    return {
        error,
        isValid: Object.keys(error).length === 0
    }

}
module.exports = validate