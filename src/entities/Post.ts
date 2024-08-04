import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Autobot } from "./Autobot";
import { Comment } from "./Comment";
import { v4 as uuidv4 } from "uuid";

@Entity()
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column()
  body!: string;

  @ManyToOne(() => Autobot, (autobot) => autobot.posts)
  autobot!: Autobot;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[];

  constructor() {
    this.id = uuidv4();
  }
}
