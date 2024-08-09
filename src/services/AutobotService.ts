import { Autobot } from "../entities/Autobot";
import { Post } from "../entities/Post";
import { Comment } from "../entities/Comment";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import io  from "../index";
import { Logger } from "../utils/logger";
import { AppDataSource } from "../ormconfig"; // Adjust the import based on your actual configuration

export class AutobotService {
  autobotRepository = AppDataSource.getRepository(Autobot);
  postRepository = AppDataSource.getRepository(Post);
  commentRepository = AppDataSource.getRepository(Comment);

  // Get all Autobots with pagination
  async getAllAutobots(limit: number, offset: number) {
    const maxLimit = 10; // Define a maximum limit to prevent excessive load
    const validatedLimit = Math.min(limit, maxLimit);
    const validatedOffset = Math.max(offset, 0);
    
    return await this.autobotRepository.find({ skip: validatedOffset, take: validatedLimit });
  }

  // Get posts for a specific Autobot
  async getPostsForAutobot(autobotId: string) {
    const autobot = await this.autobotRepository.findOne({
      where: { id: autobotId },
      relations: ['posts'],
    });
    return autobot ? autobot.posts : null;
  }

  // Get comments for a specific post
  async getCommentsForPost(postId: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['comments'],
    });
    return post ? post.comments : null;
  }

  // Method to create Autobots and related entities
  async createAutobots() {
  try {
    const { data } = await axios.get('https://jsonplaceholder.typicode.com/posts');
    
    for (let i = 0; i < 500; i++) {
      const autobot = new Autobot();
      autobot.id = uuidv4();
      autobot.name = `Autobot${i + 1}`;
      await this.autobotRepository.save(autobot);

      for (let j = 0; j < 10; j++) {
        const post = new Post();
        post.id = uuidv4();
        post.title = `Post Title ${i}-${j}`;
        post.body = 'Sample body text';
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

    const count = await this.getAutobotCount();
    Logger.info('500 Autobots created successfully');
    io.emit('autobots:count', count);
  } catch (err) {
    Logger.error('Error creating Autobots', err);
  }
}
// Add to AutobotService
async getAutobotCount(): Promise<number> {
  return this.autobotRepository.count();
}

}

// Export a single instance of AutobotService
export default new AutobotService();
