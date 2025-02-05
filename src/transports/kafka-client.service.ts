import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaClientService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    console.log('Subscribing to validate_products.reply...');

    // Suscribirse a múltiples topics de respuesta
    const replyTopics = ['validate_products'];

    replyTopics.forEach((topic) => {
      this.kafkaClient.subscribeToResponseOf(topic);
      console.log(`Subscribed to topic: ${topic}`);
    });

    await this.kafkaClient.connect();
    console.log('Kafka client connected and subscribed to reply topics.');
  }
}
