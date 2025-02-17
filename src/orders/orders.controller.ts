import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ChangeOrderStatusDto, CreateOrderRequestDto } from './dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrderCommand } from './commands/impl/create-order.command';
import { GetOrderQuery } from './queries/impl/get-order.query';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { GetAllOrdersResponseDto } from './dto/getall-orders-response.dto';
import { GetAllOrdersQuery } from './queries/impl/getall-orders.query';
import { ChangeOrderStatusCommand } from './commands/impl/change-order-status.command';

@Controller()
export class OrdersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern('createOrder')
  async createOrder(@Payload() createOrderDto: CreateOrderRequestDto) {
    const order = await this.commandBus.execute(
      new CreateOrderCommand(createOrderDto),
    );

    const plainResponse = JSON.parse(JSON.stringify(order));

    console.log('[Products Microservice] Transformed response:', plainResponse);
    return plainResponse;
  }

  @MessagePattern('findOneOrder')
  async findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return await this.queryBus.execute(new GetOrderQuery(id));
  }

  @MessagePattern('findAllOrders')
  async findAllOrders(
    @Payload() orderPaginationDto: OrderPaginationDto,
  ): Promise<GetAllOrdersResponseDto> {
    return await this.queryBus.execute(
      new GetAllOrdersQuery(orderPaginationDto),
    );
  }

  @MessagePattern('changeOrderStatus')
  async changeOrderStatus(
    @Payload() changeOrderStatusDto: ChangeOrderStatusDto,
  ) {
    return await this.commandBus.execute(
      new ChangeOrderStatusCommand(changeOrderStatusDto),
    );
  }

  @EventPattern('order_created')
  async handleOrderCreated(data: any) {
    // Manejar el evento
    console.log('Order created:', data);
  }
}
