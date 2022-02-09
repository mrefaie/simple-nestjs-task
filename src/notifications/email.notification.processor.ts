import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailNotification } from './email.notification';

@Processor('EmailNotification')
export class EmailNotificationProcessor {
  constructor(private readonly mailerService: MailerService) {}

  @Process()
  async sendEmail(job: Job<unknown>) {
    const emailNotification = job.data as EmailNotification;
    console.log({
      to: emailNotification.to,
      subject: emailNotification.subject,
      text: emailNotification.body,
    });
    await this.mailerService.sendMail({
      to: emailNotification.to,
      subject: emailNotification.subject,
      text: emailNotification.body,
    });

    return true;
  }
}
