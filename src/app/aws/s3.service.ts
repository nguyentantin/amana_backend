import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { AppLogger } from '../../core/logger';
import * as xmlParser from 'xml2json';
import {
    CopyObjectOutput,
    CopyObjectRequest,
    DeleteObjectOutput,
    DeleteObjectRequest,
    PutObjectRequest,
} from 'aws-sdk/clients/s3';
import Directory from './dto/directory';
import { FileUploadInterface } from '../storage/interface/file-upload.interface';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import SendData = ManagedUpload.SendData;

@Injectable()
export class S3Service {
    private logger = new AppLogger(S3Service.name);
    private readonly s3 = new AWS.S3();
    private readonly bucketName;

    constructor() {
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
        this.bucketName = process.env.AWS_BUCKET_NAME;
    }

    listFileInDir(prefix: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.s3.listObjects({
                Bucket: this.bucketName,
                MaxKeys: 10,
                Prefix: prefix,
            }, (err, data) => {
                if (err) {
                    reject(err);
                }

                resolve(data);
            });
        });
    }

    fileJsonGetContent(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.s3.getObject({
                Bucket: this.bucketName,
                Key: key,
            }, (err, data) => {
                if (!err) {
                    const json = JSON.parse(Buffer.from(data.Body).toString());
                    resolve(json);
                }

                reject(err);
            });
        });
    }

    filePlistGetContent(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.s3.getObject({
                Bucket: this.bucketName,
                Key: key,
            }, (err, data) => {
                if (!err) {
                    const xmlStr = Buffer.from(data.Body).toString();
                    const json = xmlParser.toJson(xmlStr);
                    resolve(json);
                }

                reject(err);
            });
        });
    }

    getUrlByKey(key: string): string {
        return this.s3.getSignedUrl('getObject', {
            Bucket: this.bucketName,
            Key: key,
            Expires: 3600,
        });
    }

    /**
     * Get S3 key to upload.
     * @param {string} filename
     * @param {Directory} directory
     * @param {string|number} id
     * @return {string}
     */
    getS3Key(filename: string, directory: Directory, id?: string|number): string {
        return id ? `${directory}/${id}/${filename}` : `${directory}/${filename}`;
    }

    /**
     * Upload file to S3
     * @param {FileUploadInterface} file
     */
    async uploadFile(file: FileUploadInterface): Promise<SendData> {
        const params: PutObjectRequest = {
            Bucket: this.bucketName,
            Key: file.s3key,
            Body: file.buffer,
        };

        return await this.s3.upload(params).promise();
    }

    /**
     * Move file to new directory on AWS-S3.
     * @param {string} originKey
     * @param {string} newKey
     * @return {CopyObjectOutput}
     */
    async moveFile(originKey: string, newKey: string): Promise<CopyObjectOutput> {
        const params: CopyObjectRequest = {
            Bucket: this.bucketName,
            CopySource: `${this.bucketName}/${originKey}`,
            Key: newKey,
        };

        const result = await this.s3.copyObject(params).promise();
        await this.deleteFile(originKey);

        return result;
    }

    /**
     * Delete file on AWS-S3.
     * @param {string} key
     * @return {DeleteObjectOutput}
     */
    async deleteFile(key: string): Promise<DeleteObjectOutput> {
        const params: DeleteObjectRequest = {
            Bucket: this.bucketName,
            Key: key,
        };
        return await this.s3.deleteObject(params).promise();
    }
}
