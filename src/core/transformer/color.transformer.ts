import { ValueTransformer } from 'typeorm';
import * as randomColor from 'randomcolor';

export class ColorTransformer implements ValueTransformer {
    to(value) {
        return value || randomColor();
    }

    from(dbValue) {
        return dbValue;
    }
}
