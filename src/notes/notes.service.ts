import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private datasource: DataSource,
  ) {}

  async create(id: number, createNoteDto: CreateNoteDto) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const note = this.noteRepository.create(createNoteDto);

      const saved = await queryRunner.manager.save(note);

      const user = await this.userRepository.findOne({
        where: { id },
        relations: { notes: true },
      });

      if (!user) throw new NotFoundException('User not found');

      user.notes.push(saved);

      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();

      return saved;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  findAll(id: number, paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.noteRepository.find({
      where: { user: { id } },
      relations: ['category'],
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: number) {
    const note = await this.noteRepository.findOneBy({ id });
    if (!note) throw new NotFoundException(`Note with id ${id} not found`);
    return note;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto) {
    const note = await this.noteRepository.preload({
      id: id,
      ...updateNoteDto,
    });

    if (!note) throw new NotFoundException(`Note with id ${id} not found`);

    return this.noteRepository.save(note);
  }

  async remove(id: number) {
    const note = await this.noteRepository.findOneBy({ id });
    if (!note)
      throw new NotFoundException(`Note with id ${id} already not exists`);

    return this.noteRepository.remove(note);
  }
}
