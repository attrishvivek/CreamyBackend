const express = require("express")
const Router = express.Router()
const SingupModel = require("../Model/CreamyUser")
const config = require('./config.json')
const mongoose = require('mongoose')
var jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library')
const { response } = require('express')

/* const Client = new OAuth2Client("51236452194-mas3vgj2qradk79dotfnr414okllvn8a.apps.googleusercontent.com") */

const Client = new OAuth2Client("1086123676521-15edel807vl6g2c30c6tkp2cevkqs0rj.apps.googleusercontent.com")

Router.post("/loginwithemail", function (req, res) {
    const { tokenId } = req.body
    Client.verifyIdToken({ idToken: tokenId, audience: "1086123676521-15edel807vl6g2c30c6tkp2cevkqs0rj.apps.googleusercontent.com" }).then((response) => {
        const { email, email_verified, name, sub, picture } = response.payload
        
        console.log(response.payload)
        var token = jwt.sign({ email: 'email' }, 'secrate');
        const accessToken = jwt.sign({ email: 'email' }, config.secret, { expiresIn: '7D' })
        const refreshToken = jwt.sign({ email: 'email' }, config.refreshTokenSecret, { expiresIn: '7D' })
        if (email_verified) {
            SingupModel.findOne({ email: email }).exec((error, user) => {
                if (error) {
                    return res.status(201).json({
                        message: "email varification fail",
                        errors: error,
                        status: false,
                    })
                } else {
                    if (user) {
                        return res.status(201).json({
                            message: "Welcome to dashboard",
                            user: user,
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            status: true,
                        })

                    } else {
                        const newUser = new SingupModel({
                            userId: new mongoose.Types.ObjectId(),
                            firstname: name,
                            email: email,
                            image: picture,
                            password: sub,
                            LoginType: 'Google'
                        })
                        const token = jwt.sign({ email }, 'secret key',
                            {
                                expiresIn: "2h",
                            }
                        );
                        newUser.token = token;
                        // console.log('username', newUser)
                        newUser.save().then((user) => {
                            res.status(201).json({
                                message: "New User Add",
                                success: true,
                                user: user,
                                token: token,
                                refreshToken: refreshToken,
                                status: 201
                            })
                        }).catch((err) => {
                            res.status(400).json({
                                message: " Server Error ",
                                success: false,
                                error: err.message
                            })
                        })
                    }
                }
            })
        }
    })
})


module.exports = Router