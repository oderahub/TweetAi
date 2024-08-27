import { Router } from 'express';
import autobotService from '../services/AutobotService';
import rateLimiter from '../middlewares/rateLimiter';

const router = Router();

/**
 * @openapi
 * /autobots:
 *   get:
 *     summary: Retrieve a list of Autobots with pagination
 *     description: This endpoint returns a paginated list of Autobots. You can specify the number of Autobots per page and the page offset.
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of Autobots to return per page.
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *         description: The number of Autobots to skip before starting to collect the result set.
 *     responses:
 *       200:
 *         description: A list of Autobots
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Autobot'
 *       500:
 *         description: Internal server error
 */
router.get('/autobots/count', async (req, res) => {
  try {
    const count = await autobotService.getAutobotCount();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Autobots count' });
  }
});


/**
 * @openapi
 * /autobots/{id}/posts:
 *   get:
 *     summary: Retrieve posts for a specific Autobot
 *     description: This endpoint returns all posts associated with a specific Autobot. If the Autobot is not found, a 404 error is returned.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the Autobot.
 *     responses:
 *       200:
 *         description: A list of posts associated with the Autobot
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       404:
 *         description: Autobot not found
 *       500:
 *         description: Internal server error
 */
router.get('/autobots/:id/posts', rateLimiter, async (req, res) => {
  const autobotId = req.params.id;

  try {
    const posts = await autobotService.getPostsForAutobot(autobotId);
    if (posts) {
      res.json(posts);
    } else {
      res.status(404).send('Autobot not found');
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

/**
 * @openapi
 * /posts/{id}/comments:
 *   get:
 *     summary: Retrieve comments for a specific post
 *     description: This endpoint returns all comments associated with a specific post. If the post is not found, a 404 error is returned.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the post.
 *     responses:
 *       200:
 *         description: A list of comments associated with the post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.get('/posts/:id/comments', rateLimiter, async (req, res) => {
  const postId = req.params.id;

  try {
    const comments = await autobotService.getCommentsForPost(postId);
    if (comments) {
      res.json(comments);
    } else {
      res.status(404).send('Post not found');
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments' });
  }
});

export default router;
