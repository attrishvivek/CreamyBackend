const express = require("express")
const Router = express.Router()
const SingupModel = require("../Model/CreamyUser")
const config = require('./config.json')
const monoose = require('mongoose')
var jwt = require('jsonwebtoken');
// const { OAuth2Client } = require('google-auth-library')
const { response } = require('express')
const fetch = require('node-fetch-npm');



Router.post("/facebooklogin", function (req, res) {
    const { userID, accessToken } = req.body;

console.log("userID",userID)
console.log("accessToken",accessToken)
    const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`;
    return (
        fetch(url, {
            method: 'GET'
        })
            .then(response => response.json())
            // .then(response => console.log(response))
            .then(response => {
                // console.log("response",response)
                const { email, name, picture } = response;
                SingupModel.findOne({ email }).exec((err, user) => {
                    if (user) {
                        // const token = jwt.sign({ _id: user._id }, config.facebooksecret, {
                        //     expiresIn: '7d'
                        // });
                        // console.log("user",user)
                        const { _id, email, name, picture } = user;
                        return res.json({
                            message: 'welcome to the ICO DashBoard',
                            user: user
                        });
                        
                    } else {
                        let password = email + config.facebooksecret;
                        user = new SingupModel({
                            firstname: name,
                            fullName: name,
                            email: email,
                            image: picture.data.url,
                            LoginType: 'Facebook'
                        });
                        // console.log("user",user)
                        user.save((err, data) => {
                            if (err) {
                                console.log('ERROR FACEBOOK LOGIN ON USER SAVE', err);
                                return res.status(400).json({
                                    error: 'User signup failed with facebook'
                                });
                            }
                            const token = jwt.sign(
                                { _id: data._id },
                                config.facebooksecret,
                                { expiresIn: '7d' }
                            );
                            const { _id, email, name, picture } = data;
                            return res.json({
                                token,
                                user: data
                            });
                        });
                    }
                });
            })
            .catch(error => {
                res.json({
                    error: 'Facebook login failed. Try later'
                });
            })
    );

})


module.exports = Router