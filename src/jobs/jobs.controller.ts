import {
  Controller,
  Request,
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
import { UserRole } from '../entities/User.entity';
import { JobsService } from './jobs.service';
import { CreateJobDTO } from './dtos/create.job.dto';
import { Job } from '../entities/Job.entity';
import { UpdateJobDTO } from './dtos/update.job.dto';
import { JobByIdPipe } from './pipes/job.by.id.pipe';

@Controller()
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @UseGuards(JwtGuard)
  @Get('jobs')
  async getAllJobs(@Request() req) {
    if (req.user.role === UserRole.MANAGER) {
      return this.jobsService.getAll();
    } else {
      return this.jobsService.getByUserId(req.user.id);
    }
  }

  @UseGuards(JwtGuard)
  @Post('jobs')
  async createJob(
    @Request() req,
    @Body() createJobDTO: CreateJobDTO,
  ): Promise<Job> {
    return this.jobsService.create({ ...createJobDTO, user: req.user } as Job);
  }

  @UseGuards(JwtGuard)
  @Put('jobs/:id')
  async UpdateJob(
    @Request() req,
    @Param('id', ParseUUIDPipe, JobByIdPipe)
    job: Job,
    @Body() updateJobDTO: UpdateJobDTO,
  ): Promise<Job> {
    if (req.user.role === UserRole.MANAGER || req.user.id === job.user.id) {
      return this.jobsService.update(job, {
        ...updateJobDTO,
      } as Job);
    } else {
      throw new UnauthorizedException();
    }
  }
}
