import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, OneToMany } from "typeorm";
import { Autobot } from "./Autobot";
import { Comment } from "./Comment";

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @ManyToOne(() => Autobot, (autobot) => autobot.posts)
  autobot!: Autobot;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[];
}
