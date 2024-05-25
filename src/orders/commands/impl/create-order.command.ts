import { ICommand } from '@nestjs/cqrs';
import { CreateOrderRequestDto } from '../../dto/create-order-request.dto';

export class CreateOrderCommand implements ICommand {
  constructor(public readonly createOrderRequestDto: CreateOrderRequestDto) {}
}
