const { Timestamp } = require("bson")

const validate = (admin) => {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    error = {}

    if (!admin.email) {
        error.email = "Please select a email"
    }
    if (!re.test(admin.password)) {
        error.password = "min 8 letter password"
    }
    if (!admin.userName) {
        error.userName = "Please select a userName"
    }


    return {
        error,
        isValid: Object.keys(error).length === 0
    }

}
module.exports = validate