import nodemailer from 'nodemailer';
import pug from 'pug';
import { convert } from 'html-to-text';
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
    this.from = `Thant Yar Zar Hein <${process.env.EMAIL_FROM}>`;
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
    // Template Rendering
    const html = pug.renderFile(`public/views/emails/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html, { wordwrap: 130 }),
    };

    await this.newTransport().sendMail(mailOptions);
  }
}
