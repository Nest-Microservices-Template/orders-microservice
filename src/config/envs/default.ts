import { OrderEntity } from '../../orders/entities/order.entity';
import { OrderItemEntity } from '../../orders/entities/orderItem.entity';
export const config = {
  db: {
    entities: [OrderEntity, OrderItemEntity],
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    schema: 'e_orders',
  },
};
