import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CustomLoggerService } from '../../../common/Logger/customerLogger.service';
import { GetOrderQuery } from '../impl/get-order.query';
import { OrderEntity } from '../../entities/order.entity';

@QueryHandler(GetOrderQuery)
export class GetOrderHandler implements IQueryHandler<GetOrderQuery> {
  constructor(
    private readonly _loggerService: CustomLoggerService,
    @InjectRepository(OrderEntity)
    private readonly repository: Repository<OrderEntity>,
  ) {}

  async execute(query: GetOrderQuery) {
    try {
      this._loggerService.info(
        `[${
          GetOrderHandler.name
        }] - Starting execution for query ${JSON.stringify(query)}`,
      );

      //Get product
      const order = await this.getOrder(query.id);

      //return product;
      return order;
    } catch (error) {
      this._loggerService.error(
        `[${GetOrderHandler.name}] - Error executing query ${JSON.stringify(
          query,
        )}. Error: ${error.message}`,
      );

      throw new RpcException({
        message: 'An error occurred: ' + error.message,
        status: HttpStatus.NOT_FOUND,
      });
    }
  }

  private async getOrder(orderId: string) {
    this._loggerService.info(
      `[${GetOrderHandler.name}] - Retrieving product ${orderId}`,
    );

    const order: OrderEntity = await this.repository.findOne({
      where: { uuid: orderId },
    });

    if (!order) {
      this._loggerService.error(
        `[${GetOrderHandler.name}] - Customer ${orderId} does not found`,
      );

      throw new Error(`Order with ID ${orderId} not found.`);
    }

    return order;
  }
}
