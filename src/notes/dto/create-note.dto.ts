import { IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  date: Date;

  @IsString()
  category: string;
}
