import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpStatus, Inject } from '@nestjs/common';
import { CustomLoggerService } from '../../../common/Logger/customerLogger.service';
import { CreateOrderCommand } from '../impl/create-order.command';
import { OrderEntity } from '../../entities/order.entity';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PRODUCT_SERVICE } from '../../../config/services';
import { firstValueFrom } from 'rxjs';
import { OrderItemEntity } from '../../entities/orderItem.entity';
import { OrderStatus } from 'src/orders/enums/order-status.enum';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHanlder implements ICommandHandler<CreateOrderCommand> {
  constructor(
    private readonly _loggerService: CustomLoggerService,

    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,

    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,

    @Inject(PRODUCT_SERVICE)
    private readonly productsClient: ClientProxy,
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
    this._loggerService.info(`[${CreateOrderHanlder.name}] - Created order`);

    //1 Confirmr los ids de los productos
    const productIds = command.createOrderRequestDto.items.map(
      (item) => item.productId,
    );
    const products: any[] = await firstValueFrom(
      this.productsClient.send({ cmd: 'validate_products' }, productIds),
    );

    // Validar que todos los productos se encontraron
    const missingProducts = productIds.filter(
      (id) => !products.find((product) => product.uuid === id),
    );

    if (missingProducts.length > 0) {
      throw new RpcException({
        message: `Products not found: ${missingProducts.join(', ')}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    // 2. Cálculos de los valores
    const totalAmount = command.createOrderRequestDto.items.reduce(
      (acc, orderItem) => {
        const product = products.find(
          (product) => product.uuid === orderItem.productId,
        );

        if (!product) {
          throw new RpcException({
            message: `Product not found: ${orderItem.productId}`,
            status: HttpStatus.BAD_REQUEST,
          });
        }

        return acc + product.price * orderItem.quantity;
      },
      0,
    );

    const totalItems = command.createOrderRequestDto.items.reduce(
      (acc, orderItem) => acc + orderItem.quantity,
      0,
    );

    // 3. Crear la orden y los items de la orden
    const order = this.orderRepository.create({
      totalAmount: totalAmount,
      totalItems: totalItems,
      status: OrderStatus.PENDING,
      paid: false,
      paidAt: null,
    });

    const savedOrder = await this.orderRepository.save(order);

    // 4. Crear y guardar los items de la orden
    const orderItems = command.createOrderRequestDto.items.map((orderItem) => {
      const product = products.find(
        (product) => product.uuid === orderItem.productId,
      );
      return this.orderItemRepository.create({
        productId: orderItem.productId,
        quantity: orderItem.quantity,
        price: product.price,
        order: savedOrder,
      });
    });

    const savedOrderItems = await this.orderItemRepository.save(orderItems);

    // Agregar los items a la orden para retornar
    savedOrder.items = savedOrderItems;

    // 5. Retornar la orden completa
    return savedOrder;
  }
}
