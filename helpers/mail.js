const transporter = require("../config/mailTransporter");
const path = require('path')
// const ejs = require('ejs')
//

const sendMail = async (recipt, subject, templateName, templateData) => {
    try {
        const templatePath = path.resolve(process.cwd(), 'resources', 'email', templateName);
        console.log(templatePath);
        // const template = await ejs.renderFile(templatePath, templateData)

        transporter.sendMail({
            from: process.env.EMAIL_FROM, // sender address
            to: recipt, // list of receivers
            subject: subject, // Subject line
            html: templateData,
        }, (error, info) => {
            if (error) {
                console.log(error);
                console.log('Error sending email');
            } else {
                console.log('Email sent: ' + info.response);
                console.log('Email sent successfully');
            }
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = sendMail


exports.EmailTemplate = function () {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mail OTP</title>
      <!-- Add any additional styles or meta tags here -->
    </head>
    <body>
      <div style="text-align: center; padding: 20px;">
        <h2>One-Time Password (OTP)</h2>
        <p>Dear <%= username %>,</p>
        <p>Your OTP for email verification is: <strong><%= otp %></strong></p>
        <p>This OTP is valid for a short duration. Do not share it with others.</p>
        <!-- Add any additional information or instructions here -->
      </div>
    </body>
    </html>`

  };

