import nodemailer from 'nodemailer';
import { UserDocument } from '@/interfaces/users.interface';

class Email {
  public to: string;
  public firstName: string;

  constructor(user: UserDocument, url: string) {
    this.to = user.email;
    this.firstName = user.name;
  }
}
