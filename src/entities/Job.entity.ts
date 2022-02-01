import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { IsByteLength, IsString, MaxLength } from 'class-validator';
import { User } from './User.entity';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  @IsString()
  @MaxLength(100)
  title: string;

  @Column('text')
  @IsString()
  @IsByteLength(0, 65535)
  description: string;

  @ManyToOne(() => User, (user) => user.jobs)
  user: User;
}
