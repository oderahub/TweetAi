import { Autobot } from "../entities/Autobot";
import { Post } from "../entities/Post";
import { Comment } from "../entities/Comment";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { Logger } from "../utils/logger";
import { AppDataSource } from "../ormconfig";
import io from "../index";


export class AutobotService {
  autobotRepository = AppDataSource.getRepository(Autobot);
  postRepository = AppDataSource.getRepository(Post);
  commentRepository = AppDataSource.getRepository(Comment);

  // Get all Autobots with pagination
  async getAllAutobots(limit: number, offset: number) {
    const maxLimit = 10; // Enforce a maximum limit of 10
    const validatedLimit = Math.min(limit, maxLimit);
    const validatedOffset = Math.max(offset, 0);

    return await this.autobotRepository.find({
      skip: validatedOffset,
      take: validatedLimit,
      order: { name: "DESC" }, 
    });
  }

  // Get the total count of Autobots
  async getAutobotCount(): Promise<number> {
    return await this.autobotRepository.count();
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

  // Method to create Autobots and related entities using JSONPlaceholder
  async createAutobots() {
    try {
      // Fetch Autobots (Users) from JSONPlaceholder
      const { data: users } = await axios.get('https://jsonplaceholder.typicode.com/users');
      const { data: postsData } = await axios.get('https://jsonplaceholder.typicode.com/posts');
      const { data: commentsData } = await axios.get('https://jsonplaceholder.typicode.com/comments');

      const autobots = [];
      const posts = [];
      const comments = [];

      // Limit the number of Autobots to 500 and create related entities
      for (let i = 0; i < Math.min(users.length, 500); i++) {
        const user = users[i];
        const autobot = new Autobot();
        autobot.id = uuidv4();
        autobot.name = user.name; // Use the user's name as the Autobot's name
        autobots.push(autobot);

        // Filter posts for this Autobot
        const userPosts = postsData.filter((post: { userId: string; }) => post.userId === user.id);

        for (let j = 0; j < userPosts.length; j++) {
          const postData = userPosts[j];
          const post = new Post();
          post.id = uuidv4();
          post.title = postData.title;
          post.body = postData.body;
          post.autobot = autobot;
          posts.push(post);

          // Filter comments for this post
          const postComments = commentsData.filter((comment: { postId: string; }) => comment.postId === postData.id);

          for (let k = 0; k < postComments.length; k++) {
            const commentData = postComments[k];
            const comment = new Comment();
            comment.id = uuidv4();
            comment.text = commentData.body;
            comment.post = post;
            comments.push(comment);
          }
        }
      }

      // Save in bulk for better performance
      await this.autobotRepository.save(autobots);
      await this.postRepository.save(posts);
      await this.commentRepository.save(comments);

      const count = await this.getAutobotCount();
      Logger.info('500 Autobots created successfully');
      io.emit('autobots:count', count);
    } catch (err) {
      Logger.error('Error creating Autobots', err);
    }
  }
}

// Export a single instance of AutobotService
export default new AutobotService();
