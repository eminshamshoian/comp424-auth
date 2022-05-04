import dotenv from "dotenv";
import transporter from "../utils/transporter.js";
import generateToken from "../utils/generateToken.js";

dotenv.config();

const sendMail = async (id, email, option) => {
  const frontendURL = process.env.FRONTEND_BASE_URL;
  if (option === "email verification") {
    const emailToken = generateToken(id, "email");
    const url = `${frontendURL}/user/confirm/${emailToken}`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Confirm Your Email To Get Access To COMP 424",
      html: `<div>
					By clicking the following account you will
					<a href="${url}">verify your account</a>
					<br>
					Valid for only 15 mins!!
				</div>
				
			`,
    };

    const mailSent = await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
    if (mailSent) return Promise.resolve(1);
  } else if (option === "forgot password") {
    const forgetPasswordToken = generateToken(id, "forgot password");
    const url = `${frontendURL}/user/password/reset/${forgetPasswordToken}`;
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Password for COMP 424",
      html: `<div>
					<br/>
					If you requested a forgot password email, click the link to
					<a href="${url}">reset your password</a>. 
					<br>
					Valid for only 10 mins!!
				</div>
				
			`,
    };

    const mailSent = await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });

    if (mailSent) return Promise.resolve(1);
  }
};

export default sendMail;
