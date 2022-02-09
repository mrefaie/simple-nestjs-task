import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bull';
import { EmailNotification } from '../../notifications/email.notification';
import { UsersService } from '../../users/users.service';
import { JobCreatedEvent } from '../events/job.created.event';

@Injectable()
export class JobCreatedListener {
  constructor(
    private usersService: UsersService,
    @InjectQueue('EmailNotification') private emailNotificationQueue: Queue,
  ) {}

  @OnEvent(['job', 'created'])
  async handleJobCreated(event: JobCreatedEvent) {
    const managers = await this.usersService.getAllManagers();
    for (const manager of managers) {
      await this.emailNotificationQueue.add(
        new EmailNotification(
          manager.email,
          'New Job',
          'New Job Has Been Created. ID: ' + event.job.id,
        ),
        {
          timeout: 3000,
          attempts: 5,
        },
      );
    }
  }
}
