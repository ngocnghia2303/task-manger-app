const sgMail = require('@sendgrid/mail')
// const sendgridAPIKey = "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"

sgMail.setApiKey(process.env.API_KEY_SENDGIRD)

const sendWelcomeEmail = (email, name) =>{
    sgMail.send({
        to: `${email}`,
        from: 'ngocty756@gmail.com',
        subject: 'Thanks for joining in',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app`,
    })
}

const sendCancelationEmail = (email, name) =>{
    sgMail.send({
        to: `${email}`,
        from: 'ngocty756@gmail.com',
        subject: 'Sorry to see you go!',
        text: `Good bye ${name}. I hope to see you back sometime soon`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}

