import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Post } from "./Post";
import { v4 as uuidv4 } from "uuid";

@Entity()
export class Autobot {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @OneToMany(() => Post, (post) => post.autobot)
  posts!: Post[];

  constructor() {
    this.id = uuidv4();
  }
}
