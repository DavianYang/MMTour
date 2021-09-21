import nodemailer from 'nodemailer';
import { UserDocument } from '@/interfaces/users.interface';

export default class Email {
  public to: string;
  public firstName: string;
  public url: string;
  public from: string;

  constructor(user: UserDocument, url: string) {
    this.to = user.email;
    this.firstName = user.name;
    this.url = url;
    this.from = `Davian Yang <${process.env.EMAIL_FROM}>`;
  }

  private newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  public async send(template: string, subject: string) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: this.url,
    };

    await this.newTransport().sendMail(mailOptions);
  }
}
