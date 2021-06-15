import { Injectable, NestMiddleware } from '@nestjs/common';
import { ContextService } from '../providers/context.service';
import { Constants } from '../constants/Constants';

@Injectable()
export class UniqueValidatorMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void): any {
        const id = req.params.id;
        ContextService.set(Constants.IGNORE_ID, Number(id));
        next();
    }
}
