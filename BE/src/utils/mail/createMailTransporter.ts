import nodemailer from 'nodemailer'
import { env } from '~/config/environment'

const createMailTransporter = () => {
  const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
      user: env.MAIL_USERNAME,
      pass: env.MAIL_PASSWORD
    }
  })
  return transporter
}
export default createMailTransporter
