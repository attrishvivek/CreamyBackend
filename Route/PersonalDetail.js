const express = require("express")
const Router = express.Router()
const personalDetails = require('../Model/MambaRegistration')
const mongoose = require('mongoose')
const personalDetailsvalitation = require('../Validation.js/personaldetailsValidation')


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


Router.post('/personalDetails', (req, res) => {
    const { legalName, streetAddress, town, State, PostCode, fundSource, Employment, alternativeAddress, useMambaSea, DOB } = req.body

    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }


    const singupprofiledetails = new personalDetails({
        userId: userid,
        legalName: legalName,
        streetAddress: streetAddress,
        town: town,
        State: State,
        PostCode: PostCode,
        fundSource: fundSource,
        Employment: Employment,
        alternativeAddress: alternativeAddress,
        useMambaSea: useMambaSea,
        DOB: DOB
    })

    singupprofiledetails.save().then((result) => {
        res.status(201).json({
            message: "add User personalDetails Successfully",
            status: true
        })
    }).catch((err) => {
        res.status(500).json({
            massage: "server error",
            err: err,
            status: false
        })
    })
})


Router.post('/AccountDetails', upload.single("image"), (req, res) => {
    const { firstname, Lastname, email, phone, Countrt, streetAddress, town, PostCode, Description, image } = req.body
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }

    const Accountdetails = new personalDetails({
        userId: userid,
        firstname: firstname,
        Lastname: Lastname,
        streetAddress: streetAddress,
        town: town,
        PostCode: PostCode,
        email: email,
        phone: phone,
        Countrt: Countrt,
        Description: Description,
        image: req.file.path
    })

    Accountdetails.save().then((result) => {
        res.status(201).json({
            message: "add User personalDetails Successfully",
            result: result,
            status: true
        })
    }).catch((err) => {
        res.status(500).json({
            massage: "server error",
            err: err,
            status: false
        })
    })

})


Router.post('/Savedaddress', (req, res) => {
    const { Countrt, streetAddress, PostCode, town, State } = req.body
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "id is required for authentication",
            status: 400,
        })
    }

    const Savedaddress = new personalDetails({
        userId: userid,
        Countrt: Countrt,
        streetAddress: streetAddress,
        PostCode: PostCode,
        town: town,
        State: State

    })

    Savedaddress.save().then((result) => {
        res.status(201).json({
            message: "add User Adress Successfully",
            result: result,
            status: true
        })
    }).catch((err) => {
        res.status(500).json({
            massage: "server error",
            err: err,
            status: false
        })
    })



})

Router.put('/personalDetailsupdate', (req, res) => {
    const { legalName, streetAddress, town, State, PostCode, fundSource, Employment, alternativeAddress, useMambaSea, DOB } = req.body

    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }
    console.log('userid', userid)

    /* const data = {
        legalName: "vivek",
        streetAddress: "ndcnl",
        town: "town",
        State: "State",
        PostCode: 121105,
        fundSource: "fundSource",
        Employment: "Employment",
        alternativeAddress: "alternativeAddress",
        useMambaSea: "useMambaSea",
        DOB: "12-12-1997"
    } */

    const data = {
        legalName: legalName,
        streetAddress: streetAddress,
        town: town,
        State: State,
        PostCode: PostCode,
        fundSource: fundSource,
        Employment: Employment,
        alternativeAddress: alternativeAddress,
        useMambaSea: useMambaSea,
        DOB: DOB
    }
    console.log('data', data)
    personalDetails.findOneAndUpdate({ _id: userid }, { $set: data }, { new: true }).then((result) => {
        res.status(200).json({
            messag: "update data successfully ",
            result: result,
            status: 200,
        })
    }).catch((err) => {
        res.json({
            error: err,
            status: 501,
        })
    })
})





Router.get('/getpersonaldetails', (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    personalDetails.find({ userId: userid }).then((result) => {
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




module.exports = Router