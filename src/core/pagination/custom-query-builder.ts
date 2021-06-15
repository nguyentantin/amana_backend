import { SelectQueryBuilder } from 'typeorm';
import { ContextService } from '../providers/context.service';
import { PAGINATION_CONFIG } from '../../config/pagination.config';
import { PaginationDto } from './dto/pagination.dto';
import { Paginator } from './paginator';

/**
 * Merging Module
 * https://www.typescriptlang.org/docs/handbook/declaration-merging.html
 */
declare module 'typeorm/query-builder/SelectQueryBuilder' {

    interface SelectQueryBuilder<Entity> {
        /** Paginate item with metadata information */
        paginate(this: SelectQueryBuilder<Entity>, page?: number, perPage?: number): Promise<PaginationDto<Entity>>;
        /** Paginate item and get result only */
        rawPaginate(this: SelectQueryBuilder<Entity>, page?: number, perPage?: number): Promise<Entity[]>;
    }
}

SelectQueryBuilder.prototype.paginate = async function<Entity>(
    this: SelectQueryBuilder<Entity>,
    page?: number,
    perPage?: number,
): Promise<PaginationDto<Entity>> {
    const paginator = new Paginator<Entity>(this, page, perPage);
    await paginator.paginate();
    return paginator.toPaginationDto();
};

SelectQueryBuilder.prototype.rawPaginate = async function<Entity>(
    this: SelectQueryBuilder<Entity>,
    page?: number,
    perPage?: number,
): Promise<Entity[]> {
    const paginator = new Paginator<Entity>(this, page, perPage);
    return await paginator.paginate();
};
