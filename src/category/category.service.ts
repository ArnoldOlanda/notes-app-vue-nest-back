import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { id: createCategoryDto.userId },
        relations: {
          categories: true,
        },
      });

      const category = this.categoryRepository.create({
        name: createCategoryDto.name,
      });
      await this.categoryRepository.save(category);

      user.categories.push(category);

      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  findAll() {
    return this.categoryRepository.find({
      where: { active: true },
      relations: { user: true },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }

  private handleDbExceptions(error: any) {
    console.log(error);

    throw new InternalServerErrorException('Internal Server error');
  }
}
