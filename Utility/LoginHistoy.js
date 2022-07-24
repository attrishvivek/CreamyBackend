
// import DeviceDetector from "device-detector-js";
const mongoose = require('mongoose')
const LoginhistroyModel = require('../Model/LoginHistry')
const { detect } = require('detect-browser');
const RequestIp = require('@supercharge/request-ip')
var Address6 = require('ip-address').Address6;

// const ip = RequestIp.getClientIp()
const browser = detect();
const request = require('request');

// request('http://usercountry.com/v1.0/json/173.194.192.101',
//     (err, response, body) => {
//         const result = JSON.parse(body);
//         result.currency;
//         console.log(result.currency)
//     }
// );




module.exports = {

    send: async (input) => {


        var address = new Address6(input.ip.clientIp);

        var teredo = address.inspectTeredo();

        teredo.client4
        const ipv4 = teredo.client4.split(':').pop()
        let country = ''
        request(`http://api.ipstack.com/${teredo.client4}?access_key=7215de94b0263dadb4daa39735edac58`,
            (err, response, body) => {
                const result = JSON.parse(body);
                country = result.country_name
            }
        );
        console.log('[=== LoginHistroy ===]', input);
        const newData = new LoginhistroyModel({
            userId: input.userId,
            date: input.date,
            Brower: browser.name,
            ip: ipv4,
            region: country,
            Stateus: input.Status
        })

        newData.save().then((results) => {
            console.log("ADD", results)
        }).catch((err) => {
            console.log("Error", err)
        })


    }
}