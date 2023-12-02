import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { verifyPassword } from 'src/helpers/verifyPassword';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signIn(username: string, password: string) {
    try {
      const user = await this.usersService.findByUser(username);
      if (!user)
        return new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);

      if (user instanceof User) {
        const checkPassword = verifyPassword(password, user.password);
        if (!checkPassword)
          return new HttpException(
            'Password incorrecto',
            HttpStatus.UNAUTHORIZED,
          );
        const payload = { name: user.name, user: user.username };
        const token = await this.jwtService.signAsync(payload);

        return { user, token, login: 'OK' };
      }
    } catch (error) {
      throw error;
    }
  }
}
