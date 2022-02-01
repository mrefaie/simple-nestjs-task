import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsRepository } from './jobs.repository';
import { JobsService } from './jobs.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobsRepository])],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
