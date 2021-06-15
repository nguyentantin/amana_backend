import { User } from '../../user/dto/user.entity';

export class JwtDto {
    expiresIn: number;
    accessToken: string;
    refreshToken: string;
    user: object|string;
}
