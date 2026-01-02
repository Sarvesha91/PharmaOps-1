import { EventEmitter } from 'node:events';

import logger from '../utils/logger';

type WorkflowEvent = {
  type: string;
  payload: Record<string, unknown>;
};

class WorkflowEngine extends EventEmitter {
  start() {
    this.on('document.updated', (event) => {
      logger.info('Workflow handling document update', event);
    });

    this.on('shipment.alert', (event) => {
      logger.info('Workflow handling shipment alert', event);
    });
  }

  dispatch(event: WorkflowEvent) {
    this.emit(event.type, event);
  }
}

export const workflowEngine = new WorkflowEngine();

