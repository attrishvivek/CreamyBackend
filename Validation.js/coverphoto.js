const { Timestamp } = require("bson")

const validate = (admin) => {
    error = {}

    if (!admin.coverphotos) {
        error.coverphotos = "required the CoverPhotos"
    }
    return {
        error,
        isValid: Object.keys(error).length === 0
    }

}
module.exports = validate