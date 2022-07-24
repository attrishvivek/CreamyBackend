const express = require("express")
const Router = express.Router()
const mongoose = require('mongoose')
const LoginhistroyModel = require('../Model/LoginHistry')
const Loginhistroyvalidation = require('../Validation.js/loginhistory')


Router.post('/loginHistory', function (req, res) {

    const { userId, date, time, Brower, ip, region, Stateus } = req.body
    const validate = Loginhistroyvalidation({
        date, Brower, ip, region, Stateus
    })
    if (!validate.isValid) {
        res.status(401).json({
            messag: validate.error,
            status: 400,
        })
    } else {
        const newData = new LoginhistroyModel({
            userId: userId,
            date: date,
            Brower: Brower,
            ip: ip,
            region: region,
            Stateus: Stateus
        })
        const saveData = newData.save().then((result) => {
            res.status(201).json({
                messag: "To add LoGin History",
                status: 201,
            })
        }).catch((err) => {
            res.json({
                messag: err,
                status: 501,
            })
        })
    }
})




Router.get('/get_LoginHistory', (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    LoginhistroyModel.find({ userId: userid }).then((result) => {
        res.status(201).json({
            message: "found Login History successfully ",
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


