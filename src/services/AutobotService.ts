import { Autobot } from "../entities/Autobot";
import { Post } from "../entities/Post";

export class AutobotService {
  // Get all Autobots with pagination
  async getAllAutobots(limit: number, offset: number) {
    return await Autobot.find({ skip: offset, take: limit });
  }

  // Get posts for a specific Autobot
  async getPostsForAutobot(autobotId: string) {
    const autobot = await Autobot.findOne({
      where: { id: autobotId },
      relations: ['posts'],
    });
    return autobot ? autobot.posts : null;
  }

  // Get comments for a specific post
  async getCommentsForPost(postId: string) {
    const post = await Post.findOne({
      where: { id: postId },
      relations: ['comments'],
    });
    return post ? post.comments : null;
  }

  // Create Autobots
  async createAutobots() {
    const autobot1 = new Autobot();
    autobot1.name = 'Optimus Prime';
    await autobot1.save();
  }
}

// Export a single instance of AutobotService
export default new AutobotService();
