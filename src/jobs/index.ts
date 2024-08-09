import { autobotQueue } from '../bullConfig';
import { autobotJobProcessor } from './autobotJob';

// Initialize the queue and define the processor
autobotQueue.process(autobotJobProcessor);
