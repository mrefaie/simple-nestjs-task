import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { Length, IsEmail } from 'class-validator';
import { sha512 } from 'js-sha512';
import { Job } from './Job.entity';

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

  @Column('varchar', { length: 128 })
  @Length(6, 100)
  password: string;

  @Column('enum', { enum: UserRole })
  role: UserRole;

  @OneToMany(() => Job, (job) => job.user)
  jobs: Job[];

  @BeforeInsert()
  async onCreateUser() {
    this.email = this.email.toLowerCase();
    this.password = sha512(this.password);
  }

  @BeforeUpdate()
  async onUpdateUser() {
    this.email = this.email.toLowerCase();
    if (this.password) {
      this.password = sha512(this.password);
    }
  }
}
