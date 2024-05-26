import { ChangeOrderStatusHandler } from './change-order-status.handler';
import { CreateOrderHanlder } from './create-order.handler';

export const CommandHandlers = [CreateOrderHanlder, ChangeOrderStatusHandler];
