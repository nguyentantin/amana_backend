import { forwardRef, Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { AwsModule } from '../aws/aws.module';

@Module({
    imports: [AwsModule],
    controllers: [TestController],
})
export class TestModule {
}
