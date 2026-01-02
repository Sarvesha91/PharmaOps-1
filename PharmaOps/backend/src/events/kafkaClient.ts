import { Kafka, type Producer } from 'kafkajs';

import { getEnv } from '../config/env';
import logger from '../utils/logger';

const kafka = new Kafka({
  clientId: 'pharmaops-api',
  brokers: getEnv('KAFKA_BROKERS', 'localhost:9092').split(','),
});

let producer: Producer | null = null;

export const getProducer = async () => {
  if (!producer) {
    producer = kafka.producer();
    await producer.connect();
    logger.info('Kafka producer connected');
  }
  return producer;
};

export const emitShipmentEvent = async (event: Record<string, unknown>) => {
  const kafkaProducer = await getProducer();
  await kafkaProducer.send({
    topic: getEnv('KAFKA_SHIPMENT_TOPIC', 'shipments.events'),
    messages: [{ value: JSON.stringify(event) }],
  });
};

