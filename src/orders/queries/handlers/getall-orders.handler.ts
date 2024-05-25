import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import { CustomLoggerService } from '../../../common/Logger/customerLogger.service';
import { RpcException } from '@nestjs/microservices';
import { GetAllOrdersQuery } from '../impl/getall-orders.query';
import { OrderEntity } from '../../entities/order.entity';
import { GetAllOrdersResponseDto } from '../../dto/getall-orders-response.dto';
import { OrderPaginationDto } from '../../dto/order-pagination.dto';
import { OrderStatus } from '../../enums/order-status.enum';

@QueryHandler(GetAllOrdersQuery)
export class GetAllOrdersHandler implements IQueryHandler<GetAllOrdersQuery> {
  constructor(
    private readonly _loggerService: CustomLoggerService,
    @InjectRepository(OrderEntity)
    private readonly repository: Repository<OrderEntity>,
  ) {}

  async execute(query: GetAllOrdersQuery): Promise<GetAllOrdersResponseDto> {
    this._loggerService.info(
      `[${GetAllOrdersHandler.name}] - Starting execution`,
    );

    const { page, limit, status } = this.getPagination(
      query.orderPaginationDto,
    );

    try {
      const whereClause = status ? { status } : {};

      const [orders, total] = await this.repository.findAndCount({
        where: whereClause,
        skip: (page - 1) * limit,
        take: limit,
      });

      const responseDto = new GetAllOrdersResponseDto();
      responseDto.data = orders;
      responseDto.meta = {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };

      return responseDto;
    } catch (error) {
      this._loggerService.error(
        `[${GetAllOrdersHandler.name}] - Error: ${error.message}`,
      );
      throw new RpcException({
        message: 'An error occurred: ' + error.message,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  private getPagination(orderPaginationDto: OrderPaginationDto): {
    page?: number;
    limit?: number;
    status?: OrderStatus;
  } {
    return {
      page: orderPaginationDto?.page,
      limit: orderPaginationDto?.limit,
      status: orderPaginationDto?.status,
    };
  }
}
