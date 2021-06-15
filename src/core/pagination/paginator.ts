import { SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';
import { PaginationMeta } from './interface/pagination-meta.interface';
import { ContextService } from '../providers/context.service';
import { PAGINATION_CONFIG } from '../../config/pagination.config';

export class Paginator<Entity> {
    public totalItems = 0;
    public items = [];
    public lastPage = 1;

    constructor(
        public readonly queryBuilder: SelectQueryBuilder<Entity>,
        public page?: number,
        public perPage?: number,
    ) {
        this.page = page || ContextService.get(PAGINATION_CONFIG.pageKey);
        this.perPage = perPage || ContextService.get(PAGINATION_CONFIG.perPageKey);
    }

    /**
     * Paginate items
     * return {Promise<Entity[]>}
     */
    async paginate(): Promise<Entity[]> {
        const [items, total] = await this.queryBuilder
            .take(this.perPage)
            .skip((this.page - 1) * this.perPage)
            .getManyAndCount();

        this.resolvePaginatedResult(items, total);

        return items;
    }

    /**
     * Handle paginate result.
     * @param {Entity[]} items
     * @param {number} total
     */
    resolvePaginatedResult(items: Entity[], total: number): void {
        this.totalItems = total;
        this.items = items;
        this.lastPage = Math.max(Math.ceil(total / this.perPage), 1);
    }

    /**
     * Convert result to pagination object.
     * return {PaginationDto<Entity>}
     */
    toPaginationDto(): PaginationDto<Entity> {
        const paginationMeta: PaginationMeta = {
            currentPage: this.page,
            perPage: this.perPage,
            from: this.firstItem(),
            to: this.lastItem(),
            total: this.totalItems,
            lastPage: this.lastPage,
        };
        return new PaginationDto<Entity>(
            this.items,
            paginationMeta,
        );
    }

    /**
     * Get the "index" of the first item in the current page.
     * @return {number}
     */
    firstItem(): number|null {
        return this.count() > 0 ? (this.page - 1) * this.perPage + 1 : null;
    }

    /**
     * Get the "index" of the last item in the current page.
     * @return {number}
     */
    lastItem(): number|null {
        return this.count() > 0 ? (this.firstItem()  + this.count() - 1) : null;
    }

    /**
     * Get number of items for the current page.
     * @return {number}
     */
    count(): number {
        return this.items.length;
    }
}
