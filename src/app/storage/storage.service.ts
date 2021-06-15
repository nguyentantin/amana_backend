import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { S3Service } from '../aws/s3.service';
import { FileUploadInterface } from './interface/file-upload.interface';
import Common from '../../helpers/common';
import Directory from '../aws/dto/directory';
import { StorageRepository } from './storage.repository';
import { Storage } from './dto/storage.entity';
import { Project } from '../project/dto/project.entity';
import { isUndefined } from '@nestjs/common/utils/shared.utils';

@Injectable()
export class StorageService {
    constructor(
        @InjectRepository(StorageRepository) private readonly storageRepository: StorageRepository,
        private readonly s3Service: S3Service,
    ) {
    }

    /**
     * Upload file to S3 server and return string.
     * @param {FileUploadInterface} file
     * @return {string}
     */
    public async uploadFile(file: FileUploadInterface): Promise<string> {
        const uuidName = Common.generateUniqueFileName(file);
        file.s3key = this.s3Service.getS3Key(uuidName, Directory.TEMPORARY_DIRECTORY);
        const { Key } = await this.s3Service.uploadFile(file);

        return Key;
    }

    /**
     * Move file from temp to project directory.
     * @param {number} projectId
     * @param {string} storageKey
     * @return {string}
     */
    public async moveFileStorage(projectId: number, storageKey: string): Promise<string> {
        const filename = Common.getFilenameFromKey(storageKey);
        const newKey = this.s3Service.getS3Key(filename, Directory.PROJECT_DIRECTORY, projectId);

        await this.s3Service.moveFile(storageKey, newKey);
        await this.saveToDatabase(filename, newKey, projectId);

        return newKey;
    }

    /**
     * Save record to database.
     * @param {string} name
     * @param {string} s3Key
     * @param {number} projectId
     * @return {Storage}
     */
    public async saveToDatabase(name: string, s3Key: string, projectId: number): Promise<Storage> {
        const storageData = {
            name,
            s3Key,
            isTemporary: false,
            storableId: projectId,
            storableType: Project.name,
            entityType: 0,
        };

        const storage = this.storageRepository.create(storageData);
        return await this.storageRepository.save(storage);
    }

    public async update(storableId: number, storableType: string, s3Key: string): Promise<any> {
        const filename = Common.getFilenameFromKey(s3Key);
        const newKey = this.s3Service.getS3Key(filename, Directory.PROJECT_DIRECTORY, storableId);

        await this.s3Service.moveFile(s3Key, newKey);

        const storage = await this.storageRepository.findOne({storableId, storableType});
        if (isUndefined(storage)) {
            await this.saveToDatabase(storableType, newKey, storableId);
        } else {
            await this.storageRepository.update({storableId, storableType}, {s3Key: newKey});
        }
    }
}
