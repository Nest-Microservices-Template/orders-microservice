import { ICommand } from '@nestjs/cqrs';
import { ChangeOrderStatusDto } from '../../dto/change-order-status.dto';

export class ChangeOrderStatusCommand implements ICommand {
  constructor(public readonly changeOrderStatus: ChangeOrderStatusDto) {}
}
