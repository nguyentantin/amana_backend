import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { ProviderType } from '../../user/dto/user-provider.entity';

export class SocialLoginDto {
    @IsEmail()
    @IsNotEmpty({
        message: 'Email is required',
    })
    readonly email: string;

    @IsNotEmpty({
        message: 'Provider ID is required',
    })
    readonly providerId: string;

    @IsNotEmpty({
        message: 'Provider type is required',
    })
    @IsEnum(ProviderType)
    readonly type: string;
}
