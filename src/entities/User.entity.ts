import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Length, IsEmail } from 'class-validator';
import { sha512 } from 'js-sha512';

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
