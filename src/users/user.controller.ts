import { Controller, Request, UseGuards, Get } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { User as UserEntity } from '../entities/User.entity';
import { User } from './user.decorator';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('user/me')
  async me(@User() user: UserEntity): Promise<UserEntity> {
    return user;
  }
}
