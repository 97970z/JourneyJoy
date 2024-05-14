// backend/config/mailer.js
import nodemailer from "nodemailer";
import { emailUser, emailPassword } from "./envConfig.js";

const mailTransport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
});

const sendVerificationEmail = async (to, token) => {
  const mailOptions = {
    from: "97970xxxx@gmail.com",
    to: to,
    subject: "[저니조이] 이메일 인증 요청",
    html: `<p>이메일 인증을 위해 <a href="https://journeyjoy.o-r.kr/api/auth/verify-email?token=${token}">여기</a>를 클릭하세요.</p>`,
  };

  mailTransport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email: ", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export { sendVerificationEmail };
