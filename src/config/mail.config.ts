import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  user: process.env.MAIL_USER,
  password: process.env.MAIL_PASSWORD,
  fromName: process.env.MAIL_FROM_NAME,
  fromEmail: process.env.MAIL_FROM_EMAIL,
}));
