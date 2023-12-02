import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('sign-in')
  loginUser(@Body() data: { username: string; password: string }) {
    return this.authService.signIn(data.username, data.password);
  }
}
