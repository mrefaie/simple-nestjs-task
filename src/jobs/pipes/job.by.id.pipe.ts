import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { Job } from '../../entities/Job.entity';
import { JobsService } from '../jobs.service';

@Injectable()
export class JobByIdPipe<T> implements PipeTransform<string, Promise<Job>> {
  constructor(private jobsService: JobsService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    const object = await this.jobsService.findById(value);

    if (!object) {
      throw new BadRequestException('Object not found');
    }

    return object;
  }
}
