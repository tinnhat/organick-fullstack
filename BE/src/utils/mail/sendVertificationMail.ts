import createMailTransporter from "./createMailTransporter"

const sendVerificationMail = (user: any) => {
  const transporter = createMailTransporter()

  const mailOptions = {
    from: `"Organick Admin" <${process.env.MAIL_USERNAME}>`,
    to: user.email,
    subject: 'Verify your email address',
    html: `<h1>Verify your email address</h1>
    <p>Please click on the following link to verify your email address:</p>
    <a href="http://localhost:3000/verifyEmail?emailToken=${user.emailToken}">Verify your Email</a>
    `
  }

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if(error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}
export default sendVerificationMail
