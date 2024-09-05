const nodeMail = require('nodemailer');
const { senderEmail, senderPassword } = require('../config/keys');

const sendMail = async ({emailTo, subject, code, content}) => {
    const transporter = nodeMail.createTransport(
        {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: senderEmail,
                pass: senderPassword,
            },
        },
    );

    const message = {
        to: emailTo,
        subject,
        html: `
        <div>
            <h3>The below code is for ${content}</h3>
            <p><strong>Code : </strong>${code}</p>
        </div>
        `
    };

    await transporter.sendMail(message);
};

module.exports = sendMail;