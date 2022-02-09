import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Job } from '../../entities/Job.entity';
import { JobsService } from '../jobs.service';

@Injectable()
export class JobByIdPipe implements PipeTransform<string, Promise<Job>> {
  constructor(private jobsService: JobsService) {}

  async transform(value: any) {
    const object = await this.jobsService.findById(value, ['user']);

    if (!object) {
      throw new BadRequestException('Object not found');
    }

    return object;
  }
}
