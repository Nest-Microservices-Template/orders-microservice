import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaClientService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    console.log('Subscribing to validate_products.reply...');
    this.kafkaClient.subscribeToResponseOf('validate_products');
    await this.kafkaClient.connect();
    console.log('Kafka client connected and subscribed to reply topics.');
  }
}
