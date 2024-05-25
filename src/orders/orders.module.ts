import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { OrderEntity } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandHandlers } from './commands/handlers';
import { CustomLoggerService } from '../common/Logger/customerLogger.service';
import { QueryHandlers } from './queries/handlers';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([OrderEntity])],
  controllers: [OrdersController],
  providers: [...CommandHandlers, ...QueryHandlers, CustomLoggerService],
})
export class OrdersModule {}
