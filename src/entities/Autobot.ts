import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from "typeorm";
import { Post } from "./Post";
import { v4 as uuidv4 } from "uuid";

@Entity()
export class Autobot extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string | undefined;

  @OneToMany(() => Post, (post) => post.autobot)
  posts!: Post[];

  constructor() {
    super();
    this.id = uuidv4();
  }
}
