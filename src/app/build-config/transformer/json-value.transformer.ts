import { ValueTransformer } from 'typeorm';

export class JsonValueTransformer implements ValueTransformer {
    from(value: string): object {
        return JSON.parse(value);
    }

    to(value: object): string {
        return JSON.stringify(value);
    }
}
