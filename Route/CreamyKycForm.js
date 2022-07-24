const express = require('express')
const Router = express.Router()
const Kycform = require('../Model/CreamyKycForm')
const ModalLogin = require('../Model/CreamyUser')
const multer = require("multer")
const mongoose = require('mongoose')
const Objectid = mongoose.Types.ObjectId;

const kycformvalidation = require('../Validation.js/CreamyKycform')



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage })

Router.post('/KYCForm', upload.array("uploads", 2), (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }
    const { tokenAddress, wallet, zipcode, Nationality, DOB, State, city, OptionAddress, address, telegramUser, phoneNumber, lastName, firstName, email, documenttype } = req.body
    const validate = kycformvalidation({
        zipcode, Nationality, DOB, State, city, address, phoneNumber, lastName, firstName, email
    })
    if (!validate.isValid) {
        res.status(422).json({
            message: validate.error,
            success: false,
        })
    } else {
        const KycForm = new Kycform({
            userProfile: userid,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            email: email,
            telegramUser: telegramUser,
            address: address,
            OptionAddress: OptionAddress,
            city: city,
            State: State,
            DOB: DOB,
            Nationality: Nationality,
            zipcode: zipcode,
            wallet: wallet,
            tokenAddress: tokenAddress,
            uploads: req.files,
            KycForm: true,
            documenttype: documenttype
        })
        KycForm.save()
        
        const data = {
            kyc: true,
           
        }

        ModalLogin.findOneAndUpdate({ _id: userid }, { $set: data }, { new: true }).then((result) => {
            res.status(200).json({
                message: "KYC Form Fill Successfully ",
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
})

Router.get('/getKYCformDetails', (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    Kycform.find({ _id: userid }).populate('user').exec((error, results) => {
        if (error) {
            return res.status(400).json({
                message: "execute error",
                error: error,
                status: 400,
            })
        } else {
            return res.status(200).json({
                message: "to get Data",
                results: results,
                status: 200,
            })
        }
    })
})

Router.get('/getKYCformDetailsadmin', (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    Kycform.find().sort({ updatedAt: 1 }).exec((error, results) => {
        if (error) {
            return res.status(400).json({
                message: "execute error",
                error: error,
                status: 400,
            })
        } else {
            return res.status(200).json({
                message: "to get Data",
                results: results,
                status: 200,
            })
        }
    })
})

Router.get('/getKYCformDetailsadminwithuser', (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    Kycform.find().populate('userProfile').exec((error, results) => {
        if (error) {
            return res.status(400).json({
                message: "execute error",
                error: error,
                status: 400,
            })
        } else {
            return res.status(200).json({
                message: "to get Data",
                results: results,
                status: 200,
            })
        }
    })
})

Router.put('/KycAdminupdate', (req, res) => {

    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    const { KycFormstatus, _id } = req.body
    data = {
        KycFormstatus: KycFormstatus,
        _id: _id,
        KycFormadmindate: new Date()
    }
    Kycform.findOneAndUpdate({ _id: _id }, { $set: data }, { new: true }).populate('user').then((result) => {
        res.status(200).json({
            message: "update data successfully ",
            result: result,
            status: 200,
        })
        // console.log("result", result.email)

        // if (result.KycFormstatus === 'Accepted') {
        //     let emailObj = {
        //         email: result.email
        //     }
        //     console.log("result1")
        //     let sendLoginCredentials = KycApproved.sendMail(emailObj)
        // } else if (result.KycFormstatus === 'Missing' || result.KycFormstatus === 'Rejected') {
        //     let emailObj = {
        //         email: result.email
        //     }
        //     console.log("result2")
        //     let sendLoginCredentials1 = kymFormPending.sendMail(emailObj)
        // } else {
        //     console.log("result3")
        //     console.log(result.transactionStats)
        // }
    }).catch((err) => {
        res.json({
            error: err,
            status: 501,
        })
    })
})

Router.post('/KYCFormsaveandupdate', upload.array("uploads", 2), (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }
    const { tokenAddress, wallet, zipcode, Nationality, DOB, State, city, OptionAddress, address, telegramUser, phoneNumber, lastName, firstName, email, documenttype } = req.body
    const validate = kycformvalidation({
        zipcode, Nationality, DOB, State, city, address, phoneNumber, lastName, firstName, email
    })
    if (!validate.isValid) {
        res.status(422).json({
            message: validate.error,
            success: false,
        })
    } else {
        const data = {
            userProfile: userid,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            email: email,
            telegramUser: telegramUser,
            address: address,
            OptionAddress: OptionAddress,
            city: city,
            State: State,
            DOB: DOB,
            Nationality: Nationality,
            zipcode: zipcode,
            wallet: wallet,
            tokenAddress: tokenAddress,
            uploads: req.files,
            KycForm: true,
            documenttype: documenttype,
            KycFormstatus: 'Update'
        }
        Kycform.findOneAndUpdate({ userProfile: Objectid(userid) }, { $set: data }, { new: true }, (error, result) => {
            if (error) {
                res.status(422).json({
                    message: "somethnk ",
                    success: false,
                })

            } else if (!result) {
                const KycForm = new Kycform({
                    userProfile: userid,
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: phoneNumber,
                    email: email,
                    telegramUser: telegramUser,
                    address: address,
                    OptionAddress: OptionAddress,
                    city: city,
                    State: State,
                    DOB: DOB,
                    Nationality: Nationality,
                    zipcode: zipcode,
                    wallet: wallet,
                    tokenAddress: tokenAddress,
                    uploads: req.files,
                    KycForm: true,
                    documenttype: documenttype
                })
                KycForm.save((error, resulte) => {
                    if (error) {
                        res.status(400).json({
                            message: "Something wrong. Contact Support",
                            result: error,
                            status: 400,
                        })
                    } else {
                        const data = {
                            KycForm: true,
                           
                        }

                        ModalLogin.findOneAndUpdate({ _id: userid }, { $set: data }, { new: true }).then((result) => {
                            res.status(200).json({
                                message: "KYC Form Fill Successfully",
                                result: resulte,
                                status: 200,
                            })
                           

                        }).catch((err) => {
                            res.json({
                                error: err,
                                status: 501,
                            })
                        })


                    }
                })
            } else {
                const data = {
                    KycForm: true,
                   
                }

                ModalLogin.findOneAndUpdate({ _id: userid }, { $set: data }, { new: true }).then((user) => {
                    res.status(200).json({
                        message: "update data successfully",
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

        })
    }
})


module.exports = Router

