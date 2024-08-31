import { IsInt, IsPositive, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsInt()
  @IsPositive()
  userId: number;

  @IsString()
  name: string;
}
