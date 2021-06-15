import { Injectable, NestMiddleware } from '@nestjs/common';
import * as _ from 'lodash';
import { PAGINATION_CONFIG } from '../../config/pagination.config';
import { ContextService } from '../providers/context.service';

/** Calculate per page value */
const resolvePerPage = (perPage: number, maxValue: number, minValue: number): number => {
    if (perPage < minValue) {
        return minValue;
    }

    if (perPage > maxValue) {
        return maxValue;
    }

    return perPage;
};

@Injectable()
export class PaginationMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void): any {
        const MIN_PAGE = 1;
        const MIN_PER_PAGE = 1;

        const pageFromRequest = Number(_.get(req.query, PAGINATION_CONFIG.pageKey, MIN_PAGE));
        const perPageFromRequest = Number(_.get(req.query, PAGINATION_CONFIG.perPageKey, PAGINATION_CONFIG.defaultPerPage));

        /** Get larger value */
        const page = Math.max(pageFromRequest, MIN_PAGE);
        const perPage = resolvePerPage(perPageFromRequest, PAGINATION_CONFIG.maxPerPage, MIN_PER_PAGE);

        ContextService.set(PAGINATION_CONFIG.pageKey, page);
        ContextService.set(PAGINATION_CONFIG.perPageKey, perPage);

        next();
    }
}
