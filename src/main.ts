import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('OrdersMS-Main');

  // Crear instancia del microservicio usando Kafka
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_SERVER], // Dirección del broker Kafka
          clientId: 'orders-service', // ID del cliente Kafka
        },
        consumer: {
          groupId: 'orders-consumer-group', // Grupo de consumidores Kafka
          allowAutoTopicCreation: true,
        },
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen();
  logger.log(`Orders Microservice running on port ${envs.port}`);
}
bootstrap();
