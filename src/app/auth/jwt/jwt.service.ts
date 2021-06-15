import { sign } from 'jsonwebtoken';
import { jwtConstants } from '../../../config/jwt.config';
import { User } from '../../user/dto/user.entity';
import { classToPlain } from 'class-transformer';

export default class JwtService {
    private expiresIn = jwtConstants.timeout;

    private secretKey = jwtConstants.secret;

    createAuthToken(user: User) {
        const { id } = user;

        return {
            expiresIn: this.expiresIn,
            accessToken: this.createToken(id),
            refreshToken: this.createToken(id),
            user: classToPlain(user), // trigger exclude option to not show password
        };
    }

    createToken(id) {
        return sign({ id }, this.secretKey, {
            expiresIn: this.expiresIn,
        });
    }
}
