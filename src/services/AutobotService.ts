import AppDataSource from "../ormconfig";
import { Autobot } from "../entities/Autobot";
import { Post } from "../entities/Post";
import { Comment } from "../entities/Comment";
import axios from "axios";
import { Logger } from "../utils/logger";
import { v4 as uuidv4 } from "uuid";

export class AutobotService {
  private autobotRepository = AppDataSource.getRepository(Autobot);
  private postRepository = AppDataSource.getRepository(Post);
  private commentRepository = AppDataSource.getRepository(Comment);

  async getAllAutobots() {
    return await this.autobotRepository.find({ relations: ["posts"] });
  }

  async getPostsForAutobot(autobotId: string) {
    const autobot = await this.autobotRepository.findOne({
      where: { id: autobotId },
      relations: ["posts"],
    });
    return autobot ? autobot.posts : null;
  }

  async getCommentsForPost(postId: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ["comments"],
    });
    return post ? post.comments : null;
  }

  async createAutobots() {
    try {
      // Fetch data from jsonplaceholder
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/posts"
      );
      for (let i = 0; i < 500; i++) {
        const autobot = new Autobot();
        autobot.id = uuidv4();
        autobot.name = `Autobot${i + 1}`;
        await this.autobotRepository.save(autobot);

        for (let j = 0; j < 10; j++) {
          const post = new Post();
          post.id = uuidv4();
          post.title = `Post Title ${i}-${j}`;
          post.body = "Sample body text";
          post.autobot = autobot;
          await this.postRepository.save(post);

          for (let k = 0; k < 10; k++) {
            const comment = new Comment();
            comment.id = uuidv4();
            comment.text = `Comment text ${i}-${j}-${k}`;
            comment.post = post;
            await this.commentRepository.save(comment);
          }
        }
      }
      Logger.info("500 Autobots created successfully");
    } catch (err) {
      Logger.error("Error creating Autobots", err);
    }
  }
}
