const express = require("express")
const Router = express.Router()
const SocialaccountDetails = require('../Model/Socialaccount')
const mongoose = require('mongoose')



Router.post('/Socialaccount', (req, res) => {
    const {  Facebook, Twitter,  Linkedin,  Instagram,  Flickr,  Github, Skype,  Google} = req.body

    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }


    const SocialAccount = new SocialaccountDetails({
        userId: userid,
        Facebook: Facebook,
        Twitter: Twitter,
        Linkedin: Linkedin,
        Instagram: Instagram,
        Flickr:  Flickr,
        Github: Github,
        Skype: Skype,
        Google:Google
        })

        SocialAccount.save().then((result) => {
        res.status(201).json({
            message: "add User SocialAccountsDetails Successfully",
            result:result,
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







module.exports = Router