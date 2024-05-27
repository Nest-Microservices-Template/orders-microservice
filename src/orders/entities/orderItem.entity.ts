import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { OrderEntity } from './order.entity';

@Entity({ name: 'order_items', schema: 'e_orders' })
export class OrderItemEntity extends BaseEntity {
  @Column({ name: 'product_id' })
  productId: string;

  @Column({ type: 'int', name: 'quantity' })
  quantity: number;

  @Column({ type: 'float', name: 'price' })
  price: number;

  @ManyToOne(() => OrderEntity, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;
}
