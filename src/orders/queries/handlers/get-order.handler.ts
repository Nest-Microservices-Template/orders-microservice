import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus, Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CustomLoggerService } from '../../../common/Logger/customerLogger.service';
import { GetOrderQuery } from '../impl/get-order.query';
import { OrderEntity } from '../../entities/order.entity';
import { PRODUCT_SERVICE } from '../../../config/services';
import { OrderItemEntity } from '../../entities/orderItem.entity';
import { firstValueFrom } from 'rxjs';

@QueryHandler(GetOrderQuery)
export class GetOrderHandler implements IQueryHandler<GetOrderQuery> {
  constructor(
    private readonly _loggerService: CustomLoggerService,

    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,

    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,

    @Inject(PRODUCT_SERVICE)
    private readonly productsClient: ClientProxy,
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
      `[${GetOrderHandler.name}] - Retrieving order ${orderId}`,
    );

    const order: OrderEntity = await this.orderRepository.findOne({
      where: { uuid: orderId },
      relations: ['items'],
    });

    if (!order) {
      this._loggerService.error(
        `[${GetOrderHandler.name}] - Order ${orderId} not found`,
      );

      throw new RpcException({
        message: `Order with ID ${orderId} not found.`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    const productIds = order.items.map((item) => item.productId);
    const products: any[] = await firstValueFrom(
      this.productsClient.send({ cmd: 'validate_products' }, productIds),
    );

    const orderWithProductNames = {
      ...order,
      items: order.items.map((orderItem) => ({
        price: orderItem.price,
        quantity: orderItem.quantity,
        productId: orderItem.productId,
        name: products.find((product) => product.uuid === orderItem.productId)
          ?.name,
      })),
    };

    return orderWithProductNames;
  }
}
