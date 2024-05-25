import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import { CustomLoggerService } from '../../../common/Logger/customerLogger.service';
import { CreateOrderCommand } from '../impl/create-order.command';
import { OrderEntity } from '../../entities/order.entity';
import { RpcException } from '@nestjs/microservices';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHanlder implements ICommandHandler<CreateOrderCommand> {
  constructor(
    private readonly _loggerService: CustomLoggerService,
    @InjectRepository(OrderEntity)
    private readonly repository: Repository<OrderEntity>,
  ) {}

  async execute(command: CreateOrderCommand): Promise<OrderEntity> {
    try {
      //Log the start of the command execution
      this._loggerService.info('[CreateProductHanlder] - Execution started');

      return await this.createOrder(command);
    } catch (error) {
      this._loggerService.error(
        `[${CreateOrderHanlder.name}] - Error executing query ${JSON.stringify(
          command,
        )}. Error: ${error.message} `,
        error.stack,
      );

      throw new RpcException({
        message: 'An error occurred: ' + error.message,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  private async createOrder(command: CreateOrderCommand): Promise<OrderEntity> {
    this._loggerService.info(`[${CreateOrderHanlder.name}] - Created client`);

    const { totalAmount, totalItems, status, paid } =
      command.createOrderRequestDto;
    const product = this.repository.create({
      totalAmount,
      totalItems,
      status,
      paid,
    });
    return await this.repository.save(product);
  }
}
