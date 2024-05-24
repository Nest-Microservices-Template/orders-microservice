import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { OrderStatus } from '../enums/order-status.enum';

@Entity({ name: 'orders', schema: 'e_orders' })
export class OrderEntity extends BaseEntity {
  @Column({ type: 'float', name: 'total_amount' })
  totalAmount: number;

  @Column({ type: 'int', name: 'total_items' })
  totalItems: number;

  @Column({ type: 'enum', enum: OrderStatus, name: 'status' })
  status: OrderStatus;

  @Column({ name: 'paid', default: false })
  paid: boolean;

  @Column({ type: 'timestamp', name: 'paid_at' })
  paidAt: Date;
}
