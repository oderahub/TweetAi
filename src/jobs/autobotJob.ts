import { Job } from 'bull';
import { AutobotService } from '../services/AutobotService';
import { Logger } from '../utils/logger';

// Job processor for creating Autobots
export const autobotJobProcessor = async (job: Job) => {
  const autobotService = new AutobotService();

  try {
    // Call the service to create Autobots
    await autobotService.createAutobots();
    Logger.info('Autobot creation process completed successfully');
  } catch (error) {
    Logger.error('Error in creating Autobots:', error);
  }
};
