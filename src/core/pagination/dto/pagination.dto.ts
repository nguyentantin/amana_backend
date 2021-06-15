import { PaginationMeta } from '../interface/pagination-meta.interface';

export class PaginationDto<Entity> {
    constructor(
        /** List data has been paginated. */
       public readonly data: Entity[],

       /** Metadata information. */
       public readonly meta: PaginationMeta,
    ) {}
}
