import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { OrderStatus } from '../enums/order-status.enum';
import { OrderItemEntity } from './orderItem.entity';

@Entity({ name: 'orders', schema: 'e_orders' })
export class OrderEntity extends BaseEntity {
  @Column({ type: 'float', name: 'total_amount' })
  totalAmount: number;

  @Column({ type: 'int', name: 'total_items' })
  totalItems: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    name: 'status',
    default: 'PENDING',
  })
  status: OrderStatus;

  @Column({ name: 'paid', default: false })
  paid: boolean;

  @Column({ type: 'timestamp', name: 'paid_at', nullable: true })
  paidAt: Date | null;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
  items: OrderItemEntity[];
}
