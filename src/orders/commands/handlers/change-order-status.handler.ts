import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import { CustomLoggerService } from '../../../common/Logger/customerLogger.service';
import { OrderEntity } from '../../entities/order.entity';
import { RpcException } from '@nestjs/microservices';
import { ChangeOrderStatusCommand } from '../impl/change-order-status.command';
import { GetOrderHandler } from '../../queries/handlers/get-order.handler';
import { GetOrderQuery } from '../../queries/impl/get-order.query';

@CommandHandler(ChangeOrderStatusCommand)
export class ChangeOrderStatusHandler
  implements ICommandHandler<ChangeOrderStatusCommand>
{
  constructor(
    private readonly _loggerService: CustomLoggerService,
    @InjectRepository(OrderEntity)
    private readonly repository: Repository<OrderEntity>,
    private readonly getOrderHandler: GetOrderHandler,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(command: ChangeOrderStatusCommand): Promise<OrderEntity> {
    try {
      //Log the start of the command execution
      this._loggerService.info('[CreateProductHanlder] - Execution started');

      return await this.changeOrderStatus(command);
    } catch (error) {
      this._loggerService.error(
        `[${ChangeOrderStatusHandler.name}] - Error executing query ${JSON.stringify(
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

  private async changeOrderStatus(
    command: ChangeOrderStatusCommand,
  ): Promise<OrderEntity> {
    this._loggerService.info(
      `[${ChangeOrderStatusHandler.name}] - Change status order`,
    );

    const { id, status } = command.changeOrderStatus;
    const order = await this.queryBus.execute(new GetOrderQuery(id));

    if (order.status === status) {
      this._loggerService.info(
        `[${ChangeOrderStatusHandler.name}] - Status is the same, no update needed`,
      );
      return order;
    }

    if (status) {
      order.status = status;
    }

    await this.repository.save(order);

    this._loggerService.info(
      `[${ChangeOrderStatusHandler.name}] - Status updated to ${status}`,
    );

    return order;
  }
}
