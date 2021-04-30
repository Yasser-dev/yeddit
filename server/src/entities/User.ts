import { IsEmail, Length } from "class-validator";
import { Entity as TypeormEntity, Column, Index, BeforeInsert } from "typeorm";
import bcrypt from "bcrypt";
import { Exclude } from "class-transformer";
import Entity from "./Entity";

@TypeormEntity("users")
export default class User extends Entity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Index()
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Index()
  @Length(3, 255, { message: "Username must be at least 3 characters long" })
  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  @Length(8, undefined, {
    message: "Password cannot be less than 8 characters long",
  })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
