import { v4 as uuidv4 } from 'uuid';
import { extname, basename } from 'path';
import * as crypto from 'crypto';
import { ObjectLiteral } from 'typeorm';
import * as moment from 'moment';
import * as queryString from 'query-string';

import { FileUploadInterface } from '../app/storage/interface/file-upload.interface';
import { BcryptHash } from './index';

class Common {
    /**
     * Get basename of storage key.
     * @param {string} key
     * @return {string}
     */
    getFilenameFromKey(key: string): string {
        return basename(key);
    }

    /**
     * Generate unique uuid string,
     * @return {string}
     */
    generateUuid(): string {
        return uuidv4();
    }

    /**
     * Generate filename with uuidv4 as name.
     * @param {FileUploadInterface} file
     * @return {string}
     */
    generateUniqueFileName(file: FileUploadInterface): string {
        return `${this.generateUuid()}${extname(file.originalname)}`;
    }

    /**
     * Generate random string.
     * @param {number} length
     * @return {string}
     */
    generateRandomString(length: number): string {
        const hexString = crypto.randomBytes(length).toString('hex');
        return hexString.substr(0, length);
    }

    /**
     * Generate a token.
     * @return {string}
     */
    generateToken() {
        const nowUnixTime = moment().valueOf().toString();
        return BcryptHash.getHash(nowUnixTime);
    }

    /**
     * Generate link to frontend page.
     * @param path
     * @param query
     * @example
     *
     * generateFrontendLink('/pwd/reset-password')
     * // => http://amana.test/pwd/reset-password
     */
    generateFrontendLink(path: string, query?: ObjectLiteral) {
        return queryString.stringifyUrl({
            url: `${process.env.FRONT_END_URL}${path}`,
            query,
        });
    }
}

export default new Common();
