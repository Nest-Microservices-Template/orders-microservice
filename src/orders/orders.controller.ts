import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller()
export class OrdersController {
  constructor() {}

  @MessagePattern('createOrder')
  create(@Payload() createOrderDto: CreateOrderDto) {}

  @MessagePattern('findAllOrders')
  findAll() {}

  @MessagePattern('findOneOrder')
  findOne(@Payload() id: number) {}

  @MessagePattern('changeOrderStatus')
  changeOrderStatus() {}
}
