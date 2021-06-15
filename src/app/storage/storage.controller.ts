import { Controller, Get, Post, UploadedFile, UseInterceptors, Res, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { StorageService } from './storage.service';
import { FileUploadInterface } from './interface/file-upload.interface';
import { SuperAuth } from '../../core/decorators/super-auth.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('storage')
@ApiTags('Storage')
export class StorageController {
    constructor(
        private readonly storageService: StorageService,
    ) {
    }

    @Post('/upload')
    @SuperAuth()
    @ApiBearerAuth()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: FileUploadInterface, @Res() res): Promise<object> {
        const key = await this.storageService.uploadFile(file);
        return res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            status: 'OK',
            data: {
                storageKey: key,
            },
        });
    }
}
