import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { UserRole } from '../entities/User.entity';
import { JobsService } from './jobs.service';
import { Roles } from '../users/roles.decorator';
import { RolesGuard } from '../users/roles.gaurd';

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
}
