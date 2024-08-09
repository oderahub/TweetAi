import { Router } from 'express';
import autobotService from '../services/AutobotService'; // Note the lowercase 'autobotService'

const router = Router();

/**
 * @openapi
 * /autobots:
 *   get:
 *     summary: Get all Autobots
 *     responses:
 *       200:
 *         description: A list of Autobots
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Autobot'
 */
router.get('/autobots', async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = parseInt(req.query.offset as string) || 0;

  try {
    const autobots = await autobotService.getAllAutobots(limit, offset);
    res.json(autobots);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Autobots' });
  }
});

/**
 * @openapi
 * /autobots/{id}/posts:
 *   get:
 *     summary: Get posts for a specific Autobot
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the Autobot
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       404:
 *         description: Autobot not found
 */
router.get('/autobots/:id/posts', async (req, res) => {
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
 *     summary: Get comments for a specific post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Post not found
 */
router.get('/posts/:id/comments', async (req, res) => {
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

/**
 * @openapi
 * /create-autobots:
 *   post:
 *     summary: Manually create Autobots
 *     responses:
 *       200:
 *         description: Autobots created successfully
 *       500:
 *         description: Error in creating Autobots
 */
router.post('/create-autobots', async (req, res) => {
  try {
    await autobotService.createAutobots();
    res.send('Autobots created successfully');
  } catch (error) {
    res.status(500).send('Error in creating Autobots');
  }
});

export default router;
