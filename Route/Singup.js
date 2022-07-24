const express = require("express")
const Router = express.Router()
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
const path = require('path')
const crypto = require('crypto')
const LoginHistory = require('../Utility/LoginHistoy')
const config = require('./config.json')
const mongoose = require('mongoose')
const nodemailer = require("nodemailer");
const { google, identitytoolkit_v3 } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const SingupModel = require("../Model/MambaRegistration")
const SendEmail = require("../Utility/SendEmail")
const validationrouter = require("../Validation.js/SingupValidation")
const profileupdate = require("../Validation.js/updateprofilevalidation")
const validationLogin = require("../Validation.js/login")
const validation_reserpssword = require("../Validation.js/reset-password")
const RequestIp = require('@supercharge/request-ip')
var get_ip = require('ipware')().get_ip;
var requestCountry = require('request-country');

// app.use(RequestIp.mw())

const multer = require("multer")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage })


const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 993,
    auth: {
        user: 'Abhidilli281298@gmail.com',
        pass: 'abhidilli123@',
        clientId: "494560904228-1t36c4tj3dc9kuvvk66tll8c8s440fj3.apps.googleusercontent.com",
        clientSecret: "eOOBADt5KtnxUGfw33PdJfRs",
        refreshToken: "1//04PzMptgbF5cxCgYIARAAGAQSNwF-L9Ir1FvAofh8UZNgdeGcy8rYk-3nZ89oh8ryoq3a0aTXnmuosVWg2txvIDcAhvAmZ3awiEg"
    },
    tls: { rejectUnauthorized: false },
    debug: true
});



Router.post('/registration', (req, res) => {

    const { fullName, userName, email, password } = req.body



    const validate = validationrouter({ fullName, userName, email, password })

    if (!validate.isValid) {
        return res.status(400).json({
            message: "validation Errors",
            errors: validate.error,
            status: false,
        });
    } else {
        let hashedPassword = bcrypt.hashSync(req.body.password, 8)
        // console.log(hashedPassword);
        // const token = jwt.sign({ email }, 'secret key')
        SingupModel.findOne({ email: email }).exec((error, user) => {
            if (error) {
                return res.status(400).json({
                    message: "email varified error",
                    errors: error,
                    status: false,
                })
            } else {
                if (user) {
                    return res.status(200).json({
                        message: "This email already registard ",
                        user: user,
                        status: false,
                    })

                } else {

                    SingupModel.findOne({ userName: userName }).exec((error, user) => {
                        if (error) {
                            return res.status(400).json({
                                message: "UserName  error",
                                errors: error,
                                status: false,
                            })
                        } else {
                            if (user) {
                                return res.status(200).json({
                                    message: "This Username already registard ",
                                    user: user,
                                    status: false,
                                })

                            } else {
                                const singup = new SingupModel({
                                    userId: new mongoose.Types.ObjectId(),
                                    userName: userName,
                                    email: email,
                                    fullName: fullName,
                                    password: hashedPassword,
                                    LoginType: 'Normal'

                                })
                                const token = jwt.sign({ email }, 'secret key',
                                    {
                                        expiresIn: "2h",
                                    }
                                );
                                // save user token
                                singup.token = token;
                                singup.save().then((results) => {
                                    res.status(201).json({
                                        message: "New User Add Successfully",
                                        status: true,
                                        results: results
                                    })


                                }).catch((err) => {
                                    res.status(500).json({
                                        massage: "server error",
                                        err: err,
                                        status: false
                                    })
                                })

                            }
                        }
                    })

                }


            }
        })

    }
})



Router.post('/login', (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    var ip_info = get_ip(req);

    const { email, password } = req.body
    const validate = validationLogin({ email, password })

    if (!validate.isValid) {
        return res.status(422).json({
            message: "validation Errors",
            errors: validate.error,
            status: false,
        });
    } else {
        SingupModel.findOne({ email: email }).exec((error, user) => {
            if (error) {
                return res.status(422).json({
                    message: "email varifation fail",
                    errors: error,
                    status: false,
                })
            }
            if (!user) {
                {
                    return res.status(401).json({
                        message: "Email is not registered",
                        user: user,
                        status: 400,
                    })
                }

            }
            bcrypt.compare(password, user.password, (error, match) => {

                const token = jwt.sign({ email }, 'secret key', {
                    expiresIn: "2h",
                })
                if (error) {
                    return res.status(401).json({
                        message: "password does not match",
                        status: 400,
                    })

                } else {
                    if (match) {
                        res.status(201).json({
                            message: "Login User sucessfully",
                            status: true,
                            image: user.image,
                            user: user,
                            match: match
                        })
                        let LoginObj = {
                            userId: user.userId,
                            Status: 'True',
                            date: user.updatedAt,
                            ip: ip_info
                        }
                        let sendLoginCredentials = LoginHistory.send(LoginObj)


                    } else {
                        res.status(401).json({
                            message: " password does not match",
                            status: 400
                        })

                    }
                }
            })

        })

    }
})

Router.post('/reset-password', (req, res) => {

    const { email } = req.body
    const validate = validation_reserpssword({ email })
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }
        const token = buffer.toString("hex")
        if (!validate.isValid) {
            return res.status(400).json({
                message: "validation Errors",
                errors: validate.error,
                status: false,
            });
        } else {
            SingupModel.findOne({ email: email }).exec((error, user) => {
                if (error) {
                    return res.status(422).json({
                        message: "Email Verification failed",
                        errors: error,
                        status: false,
                    })
                }
                if (!user) {
                    {
                        return res.status(201).json({
                            message: "Email is not registered",
                            user: user,
                            status: false,
                        })
                    }

                }

                user.token = token
                user.expireToken = Date.now() + 3600000
                user.save().then((result) => {
                    res.status(201).json({
                        message: "Forget Password Link Send",
                        status: 201
                    })
                    // let emailObj = {
                    //     token: token,
                    //     email: email
                    // }
                    // let sendLoginCredentials = SendEmail.sendMail(emailObj)
                }).catch((err) => {
                    res.status(500).json({
                        massage: "server error",
                        err: err,
                        status: 500
                    })
                })

            })
        }
    })
})


Router.post('/newpassword', (req, res) => {
    const { newpassword, token } = req.body

    SingupModel.findOne({ token: token }).exec((error, user) => {

        if (error) {

            return res.status(422).json({
                message: "to get Token Error",
                errors: error,
                status: false,
            })

        } else if (!user) {
            return res.status(422).json({
                message: "Token are not found",
                errors: error,
                status: false,
            })
        } else {
            let hashedPassword = bcrypt.hashSync(newpassword, 8)
            user.password = hashedPassword
            user.save().then((result) => {
                res.json({ message: "Password changed" })
            })
        }
    })

})

Router.get('/ProfileDetails', (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    SingupModel.find({ userId: userid }).then((result) => {
        res.status(201).json({
            message: "found data successfully ",
            result: result,
            status: 201,
        })
    }).catch((err) => {
        res.status(400).json({
            message: err,
            status: 400,
        })
    })

})



Router.get('/allProfileDetails', (req, res) => {
    // const userid = req.headers['userid']
    // if (!userid) {
    //     return res.status(400).json({
    //         message: "User Id Required on Header",
    //         status: 400,
    //     })
    // }
    SingupModel.find().then((result) => {
        res.status(201).json({
            message: "found data successfully ",
            result: result,
            status: 201,
        })
    }).catch((err) => {
        res.status(400).json({
            message: err,
            status: 400,
        })
    })

})


Router.put("/updateProfile", upload.single("image"), (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }
    const { fullName, userName, email } = req.body
    const validate = profileupdate({
        fullName, userName, email
    })
    if (!validate.isValid) {
        res.status(422).json({
            messag: validate.error,
            success: false,
        })
    } else {
        if (!req.file) {
            const data = {
                fullName: fullName,
                userName: userName,
                email: email
            }
            SingupModel.findOneAndUpdate({ _id: userid }, data, { new: true }).then((result) => {
                res.status(200).json({
                    message: "update data successfully ",
                    result: result,
                    status: 200,
                })
            }).catch((err) => {
                res.json({
                    error: err,
                    status: 501,
                })
            })
        } else {
            const data = {
                fullName: fullName,
                userName: userName,
                email: email,
                image: req.file.path
            }
            SingupModel.findOneAndUpdate({ _id: userid }, data, { new: true }).then((result) => {
                res.status(200).json({
                    message: "update data successfully ",
                    result: result,
                    status: 200,
                })
            }).catch((err) => {
                res.json({
                    error: err,
                    status: 501,
                })
            })
        }



    }
})


Router.put("/ChangePassword", (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            messag: "Id is requried for Authentication",
            status: 400,
        })
    }
    const { oldpassword, newpassword } = req.body

    SingupModel.findOne({ _id: userid }).exec((error, user) => {
        console.log("userid", userid)
        if (error) {
            return res.status(422).json({
                message: "your are not allowed",
                errors: error,
                status: false,
            })
        } else {
            if (user) {
                bcrypt.compare(oldpassword, user.password, (error, match) => {
                    console.log("oldpassword", oldpassword)
                    console.log("user.password", user.password)
                    if (error || !match) {
                        return res.status(400).json({
                            message: "please check your old Password",
                            status: false,
                        })

                    } else {
                        if (match) {
                            let hashedPassword = bcrypt.hashSync(newpassword, 8)
                            user.password = hashedPassword
                            user.save().then((results) => {
                                res.status(201).json({
                                    message: "Change Password successfully",
                                    status: 201,
                                    results: results
                                })
                            }).catch((err) => {
                                res.status(500).json({
                                    massage: "server error",
                                    err: err,
                                    status: 500
                                })
                            })
                        }
                    }
                })
            }
        }
    })

})

Router.put('/frientsrequest', (req, res) => {
    const { friendId } = req.body

    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }

    if (friendId === userid) {
        return res.status(422).json({
            message: "your are not allowed",
            status: false,
        })
    } else {
        const friendaddme = SingupModel.findOne({ userId: friendId })
        SingupModel.findOneAndUpdate({ userId: userid }, { $push: { Friend: friendId } }, { new: true }, (error, result) => {
            if (error) {
                return res.status(422).json({ error: error })
            }

            SingupModel.findOneAndUpdate({ userId: friendId }, { $push: { Friend: friendId } }, { new: true }).then((result) => {
                res.status(200).json({
                    messag: "Add Fiend successfully ",
                    result: result,
                    status: 200,
                })
                SingupModel.findOneAndUpdate

            }).catch((err) => {
                res.json({
                    error: err,
                    status: 501
                })
            })
        })
    }
})






Router.put('/Unfrients', (req, res) => {
    const { friendId } = req.body

    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }

    if (friendId === userid) {
        return res.status(422).json({
            message: "your are not allowed",
            status: false,
        })
    } else {
        SingupModel.findOneAndUpdate({ userId: userid }, { $pull: { Friend: friendId } }, { new: true }, (error, result) => {
            if (error) {
                return res.status(422).json({ error: error })
            }

            SingupModel.findOneAndUpdate({ userId: friendId }, { $pull: { Friend: friendId } }, { new: true }).then((result) => {
                res.status(200).json({
                    message: " UnFiend successfully ",
                    result: result,
                    status: 200,
                })
                SingupModel.findOneAndUpdate

            }).catch((err) => {
                res.json({
                    error: err,
                    status: 501
                })
            })
        })
    }
})

Router.get('/getFrienddetails', async (req, res) => {

    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }

    try {
        const user = await SingupModel.findOne({ userId: userid });
        const friends = await Promise.all(
            user.Friend.map((friendId) => {
                return SingupModel.findOne({ userId: friendId });
            })
        );
        let friendList = [];
        friends.map((friend) => {
            const { userId, _id, userName, fullName } = friend;
            friendList.push({ userId, _id, userName, fullName });
        });
        res.status(200).json(friendList)
    } catch (err) {
        res.status(500).json(err);
        console.log("error", err)
    }

})


module.exports = Router