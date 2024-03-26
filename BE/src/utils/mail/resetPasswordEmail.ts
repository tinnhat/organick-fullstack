import createMailTransporter from './createMailTransporter'

const resetPasswordMail = (user: any, newPassword: string) => {
  const transporter = createMailTransporter()
  const mailOptions = {
    from: `"Organick Admin" <${process.env.MAIL_USERNAME}>`,
    to: user.email,
    subject: 'Reset Password',
    html: `<h1>Reset your password</h1>

    <p>This is your password reset. Please change after login.</p>
    <p>${newPassword}</p>
    `
  }

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      console.log('send mail error', error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}
export default resetPasswordMail
