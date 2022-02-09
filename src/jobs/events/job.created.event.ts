import { Job } from '../../entities/Job.entity';

export class JobCreatedEvent {
  constructor(public job: Job) {}
}
