import { env } from '../../config/environment'
import createMailTransporter from './createMailTransporter'

const sendForgotPasswordEmail = (user: any, resetToken: string) => {
  const transporter = createMailTransporter()
  const resetUrl = `${env.HOST_FE}/login/resetPassword/${resetToken}`

  const mailOptions = {
    from: `"Organick Admin" <${process.env.MAIL_USERNAME}>`,
    to: user.email,
    subject: 'Reset Password',
    html: `<h1>Reset your password</h1>
    <p>Please click on the following link to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
    <p>If you did not request a password reset, please ignore this email.</p>
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
export default sendForgotPasswordEmail