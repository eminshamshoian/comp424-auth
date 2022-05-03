import dotenv from "dotenv";
import transporter from "../utils/transporter.js";
import generateToken from "../utils/generateToken.js";

dotenv.config();

const sendMail = async (id, email, option) => {
  const frontendURL = "http://424project.pw";

  // send email for the email verification option
  if (option === "email verification") {
    // create a new JWT to verify user via email
    const emailToken = generateToken(id, "email");
    const url = `${frontendURL}/user/confirm/${emailToken}`;

    // set the correct mail option
    const mailOptions = {
      from: process.env.EMAIL, // sender address
      to: email,
      subject: "Confirm Your Email To Get Access To COMP 424", // Subject line
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

    // send a promise since nodemailer is async
    if (mailSent) return Promise.resolve(1);
  }
  // send a mail for resetting password if forgot password
  else if (option === "forgot password") {
    // create a new JWT to verify user via email
    const forgetPasswordToken = generateToken(id, "forgot password");
    const url = `${frontendURL}/user/password/reset/${forgetPasswordToken}`;
    const mailOptions = {
      from: process.env.EMAIL, // sender address
      to: email,
      subject: "Reset Password for COMP 424", // Subject line
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
