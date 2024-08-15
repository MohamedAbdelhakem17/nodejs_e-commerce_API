const nodemailer = require("nodemailer");

const {
  emailPort,
  email,
  password,
  emailHost,
  emailService,
} = require("../config/variable");

const transporter = nodemailer.createTransport({
  service: emailService,
  host: emailHost,
  port: emailPort,
  secure: true,
  auth: {
    user: email,
    pass: password,
  },
});

const sendEmail = async (options) => {
  await transporter.sendMail(
    {
      from: email,
      to: options.mailTo,
      subject: options.subject,
      html: options.html,
    },
  );
};

module.exports = sendEmail;
