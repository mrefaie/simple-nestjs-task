import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  MaxLength,
  MinLength,
  IsByteLength,
  IsDefined,
} from 'class-validator';

export class CreateJobDTO {
  @IsDefined({ message: 'Job Title is required' })
  @IsString({ message: 'Job Title must be a string' })
  @MinLength(1, {
    message: 'Job Title must be at least $constraint1 characters',
  })
  @MaxLength(100, {
    message: 'Job Title must be at most $constraint1 characters',
  })
  @ApiProperty({
    description: 'Job Title',
    minLength: 1,
    maxLength: 100,
    nullable: false,
  })
  title: string;

  @IsString({ message: 'Job Description must be a string' })
  @IsByteLength(0, 65535, {
    message: 'Job Description must be at most $constraint2 bytes',
  })
  @ApiPropertyOptional({
    description: 'Job Description',
    nullable: true,
    minLength: 1,
    maxLength: 65535,
  })
  description: string;
}
