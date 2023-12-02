import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './user.entity';
import { encryptPassword } from 'src/helpers/encryptPassword';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(user: CreateUserDto): Promise<User | HttpException> {
    const userExists = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (userExists) {
      return new HttpException('El usuario ya existe', HttpStatus.CONFLICT);
    }
    const newUser = this.userRepository.create({
      ...user,
      password: encryptPassword(user.password),
    });
    return this.userRepository.save(newUser);
  }

  listUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUser(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user)
      return new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
    return user;
  }

  async findByUser(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  async updateUser(id: number, data: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });
    return this.userRepository.update({ id: user.id }, data);
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user)
      return new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
    return this.userRepository.delete({ id });
  }
}
