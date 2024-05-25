import { IQuery } from '@nestjs/cqrs';
import { OrderPaginationDto } from '../../dto/order-pagination.dto';

export class GetAllOrdersQuery implements IQuery {
  constructor(public orderPaginationDto: OrderPaginationDto) {}
}
