import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { Length, IsEmail } from 'class-validator';
import { Job } from './Job.entity';
import hash from '../helpers/hash';
import { Exclude } from 'class-transformer';

export enum UserRole {
  REGULAR = 'Regular',
  MANAGER = 'Manager',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255 })
  @IsEmail()
  email: string;

  @Exclude()
  @Column('varchar', { length: 128, select: false })
  @Length(6, 100)
  password: string;

  @Column('enum', { enum: UserRole })
  role: UserRole;

  @OneToMany(() => Job, (job) => job.user)
  jobs: Job[];

  @BeforeInsert()
  async onCreateUser() {
    this.email = this.email.toLowerCase();
    this.password = hash(this.password);
  }

  @BeforeUpdate()
  async onUpdateUser() {
    this.email = this.email.toLowerCase();
    if (this.password) {
      this.password = hash(this.password);
    }
  }
}
