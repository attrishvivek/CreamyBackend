
"use strict"

var api_key = 'e3ce9a262a2cf03006917859b2348ee9-7b8c9ba8-41ae150c';
var domain = 'sandboxad373a514bef4997b7d752c21f81f844.mailgun.org';
var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });

module.exports = {


    //Helper for sending Email
    sendMail: async (input) => {
        console.log('[=== Send Email Request ===]', input);
        await mailgun.messages().send({
            from: `Mamba Wallet <vivekattrish76@gmail.com>`,
            to: input.email,
            subject: 'ForgetPassword Details',
            text: `Here is Details`,
            html: `<h4>Hello  ${input.email}</h1>
            <a href='http://localhost:3000/forgot/${input.token}'>Link<a>`

        }).then((data) => {
            console.log(data)
            console.log('Message sent')
        }).catch((error) => {

            console.log(error)

        })


    }
}