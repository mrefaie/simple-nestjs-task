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
  title: string;

  @IsString({ message: 'Job Description must be a string' })
  @IsByteLength(0, 65535, {
    message: 'Job Description must be at most $constraint2 bytes',
  })
  description: string;
}
