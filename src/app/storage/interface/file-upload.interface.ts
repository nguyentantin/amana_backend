/** Declare interface of upload file */
export interface FileUploadInterface {
    /** Field name in sent request */
    fieldname: string;
    /** Origin name of file */
    originalname: string;
    /** File encoding */
    encoding: string;
    /** File mime type */
    mimetype: string;
    /** File buffer data */
    buffer: Buffer;
    /** Size of file */
    size: number;
    /** S3 key to upload */
    s3key?: string;
}
