import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { KafkaClientService } from './kafka-client.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
        name: 'KAFKA_CLIENT',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: [configService.get<string>('KAFKA_SERVER')],
              clientId: 'orders-service',
            },
            consumer: {
              groupId: 'orders-consumer-group',
              allowAutoTopicCreation: true,
            },
          },
        }),
      },
    ]),
  ],
  providers: [KafkaClientService],
  exports: [ClientsModule],
})
export class KafkaModule {}
