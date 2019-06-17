const nodemailer = require('nodemailer');
const fs = require('fs');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'piano.fe.test@gmail.com',
    pass: 'qwerty!QAZ2wsx'
  }
});

class Mailer {
  static async send(to, subject, text, html) {
    const mailOptions = {
      from: '"Piano FE task" <piano.fe.test@gmail.com>',
      to,
      subject,
      text,
      html
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, async (err, info) => {
        if (err) reject({ name: 'MailerError', message: err });
        else {
          console.log(`mailer.service.js@@ email sent to ${to}`);
          resolve();
        }
      })
    })
  }
}

module.exports = Mailer;
