import amqp, { Channel, Connection } from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || "";

let channel: Channel;

export const connectRabbitMQ = async (): Promise<void> => {
  try {
    const connection: Connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.error("Failed to connect to RabbitMQ", error);
    throw error;
  }
};

export const publishToQueue = async (
  queue: string,
  message: string
): Promise<void> => {
  try {
    if (!channel)
      throw new Error("Channel is not created. Call connectRabbitMQ first.");
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message));
    console.log(`Message sent to queue ${queue}: ${message}`);
  } catch (error) {
    console.error("Failed to publish message", error);
    throw error;
  }
};

export const consumeFromQueue = async (
  queue: string,
  callback: (msg: amqp.ConsumeMessage | null) => Promise<void>
): Promise<void> => {
  try {
    if (!channel)
      throw new Error("Channel is not created. Call connectRabbitMQ first.");
    await channel.assertQueue(queue, { durable: true });
    await channel.consume(
      queue,
      async (msg) => {
        if (msg) {
          try {
            await callback(msg);
            channel.ack(msg);
          } catch (error) {
            channel.nack(msg);
          }
        }
      },
      { noAck: false }
    );
    console.log(`Consuming from queue ${queue}`);
  } catch (error) {
    console.error("Failed to consume message", error);
    throw error;
  }
};
