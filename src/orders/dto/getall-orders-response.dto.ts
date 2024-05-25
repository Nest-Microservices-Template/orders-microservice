import { OrderEntity } from '../entities/order.entity';

export class GetAllOrdersResponseDto {
  data: OrderEntity[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}
