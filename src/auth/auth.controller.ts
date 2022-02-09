import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { LocalGuard } from './local.guard';
import { AuthService } from './auth.service';
import { ApiBody } from '@nestjs/swagger';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({
    schema: {
      type: 'object',
      example: { email: 'manager@example.com', password: '123456' },
    },
  })
  @UseGuards(LocalGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
