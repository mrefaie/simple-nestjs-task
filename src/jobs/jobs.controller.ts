import {
  Controller,
  Post,
  UseGuards,
  Get,
  Body,
  Put,
  Param,
  UnauthorizedException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { User as UserEntity } from '../entities/User.entity';
import { JobsService } from './jobs.service';
import { CreateJobDTO } from './dtos/create.job.dto';
import { Job } from '../entities/Job.entity';
import { UpdateJobDTO } from './dtos/update.job.dto';
import { JobByIdPipe } from './pipes/job.by.id.pipe';
import { User } from '../users/user.decorator';
import { Action } from '../casl/casl.actions';

@Controller()
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @UseGuards(JwtGuard)
  @Get('jobs')
  async getAllJobs(@User() user: UserEntity): Promise<Job[]> {
    if (user.ability().can(Action.READ, new Job({}))) {
      return this.jobsService.getAll(['user']);
    } else if (user.ability().can(Action.READ, new Job({ user }))) {
      return this.jobsService.getAllFilteredByUserId(user.id);
    } else {
      throw new UnauthorizedException();
    }
  }

  @UseGuards(JwtGuard)
  @Post('jobs')
  async createJob(
    @User() user: UserEntity,
    @Body() createJobDTO: CreateJobDTO,
  ): Promise<Job> {
    return this.jobsService.create({ ...createJobDTO, user } as Job);
  }

  @UseGuards(JwtGuard)
  @Put('jobs/:id')
  async updateJob(
    @User() user: UserEntity,
    @Param('id', ParseUUIDPipe, JobByIdPipe)
    job: Job,
    @Body() updateJobDTO: UpdateJobDTO,
  ): Promise<Job> {
    if (user.ability().can(Action.UPDATE, job)) {
      return this.jobsService.update(job, {
        ...updateJobDTO,
      } as Job);
    } else {
      throw new UnauthorizedException();
    }
  }
}
