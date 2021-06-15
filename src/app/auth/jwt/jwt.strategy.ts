import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../../../config/jwt.config';
import { JwtPayload } from '../interfaces/jwt-payload.inferface';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: (request) => {
                const token = ExtractJwt.fromAuthHeaderAsBearerToken();
                const tokenFromParams = ExtractJwt.fromUrlQueryParameter('token');
                return token(request) || tokenFromParams(request);
            },
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.authService.validateUser(payload);

        if ( !user ) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
