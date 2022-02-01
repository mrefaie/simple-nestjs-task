import { Injectable } from '@nestjs/common';
import { Job } from '../entities/Job.entity';
import { JobsRepository } from './jobs.repository';

@Injectable()
export class JobsService {
  constructor(private jobsRepository: JobsRepository) {}

  async getAll(): Promise<Job[]> {
    return this.jobsRepository.find();
  }

  async getByUserId(userId: string): Promise<Job[]> {
    return this.jobsRepository.find({ where: { User: { id: userId } } });
  }
}
