import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { UsersModule } from 'src/users/users.module';
import { Category } from 'src/category/entities/category.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Note]),
    TypeOrmModule.forFeature([Category]),
  ],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
