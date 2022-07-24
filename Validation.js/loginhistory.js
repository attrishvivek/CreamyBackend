const { Timestamp } = require("bson")

const validate = (admin) => {
    error = {}

    if (!admin.date) {
        error.date = "Please fill a date"
    }
    if (!admin.Brower) {
        error.Brower = "Please fill a Brower"
    }
    if (!admin.ip) {
        error.ip = "Please fill a ip Address"
    }
    if (!admin.region) {
        error.region = "Please fill a region"
    }
    if (!admin.Stateus) {
        error.Stateus = "Please fill a Stateus"
    }


    return {
        error,
        isValid: Object.keys(error).length === 0
    }

}
module.exports = validate