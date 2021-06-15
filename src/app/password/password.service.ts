import { Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { AppLogger } from '../../core/logger';

@Injectable()
export class PasswordService {
    private logger = new AppLogger(PasswordService.name);

    constructor(
        private readonly userService: UserService,
    ) {}
}
