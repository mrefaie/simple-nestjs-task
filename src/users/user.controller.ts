import { Controller, Request, UseGuards, Get } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('user/me')
  async me(@Request() req) {
    return req.user;
  }
}
