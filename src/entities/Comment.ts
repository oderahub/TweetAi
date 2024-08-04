import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Post } from "./Post";
import { v4 as uuidv4 } from "uuid";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  text!: string;

  @ManyToOne(() => Post, (post) => post.comments)
  post!: Post;

  constructor() {
    this.id = uuidv4();
  }
}
