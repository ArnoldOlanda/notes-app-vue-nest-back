import { Note } from 'src/notes/entities/note.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.categories)
  user: User;

  @OneToMany(() => Note, (note) => note.category)
  notes: Note;

  @Column('varchar')
  name: string;

  @Column('tinyint', { default: 1 })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
