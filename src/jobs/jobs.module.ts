import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { JobsRepository } from './jobs.repository';
import { JobsService } from './jobs.service';
import { JobCreatedListener } from './listeners/job.created.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobsRepository]),
    UsersModule,
    BullModule.registerQueue({
      name: 'EmailNotification',
    }),
  ],
  providers: [JobsService, JobCreatedListener],
  exports: [JobsService],
})
export class JobsModule {}
