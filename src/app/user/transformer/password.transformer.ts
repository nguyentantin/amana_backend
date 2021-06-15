import { ValueTransformer } from 'typeorm';
import { BcryptHash } from '../../../helpers';

export class PasswordTransformer implements ValueTransformer {
    to(value) {
        return BcryptHash.getHash(value);
    }

    from(dbValue) {
        return dbValue;
    }
}
