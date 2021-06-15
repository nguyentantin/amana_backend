import { Injectable } from '@nestjs/common';
import * as SgMail from '@sendgrid/mail';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserService } from '../user/user.service';
import { UserNotFoundException } from '../../exceptions/auth/user-not-found.exception';
import { AlreadyActiveUserException } from '../../exceptions/auth/already-active-user.exception';
import { BcryptHash } from '../../helpers';
import { VerifyEmail } from '../verify-email/dto/verify-email.entity';

@Injectable()
export class MailService {

    constructor(
        private readonly userService: UserService,
        @InjectRepository(VerifyEmail) private readonly verifyEmailRepo: Repository<VerifyEmail>,
    ) {
        SgMail.setApiKey(process.env.DATA_GRIP_API_KEY);
    }

    async sendVerifyEmail(email: string): Promise<any> {
        const user = await this.userService.findByEmail(email);

        if (!user) {
            throw new UserNotFoundException();
        }

        if (user.isActive) {
            throw new AlreadyActiveUserException();
        }

        // @TODO: implement send email max 3 times in one hours

        const link = await this.generateLink(user.email);

        const data = {
            to: user.email,
            from: {
                name: 'Amana Team',
                email: process.env.FROM_EMAIL_ADDRESS,
            },
            subject: 'Verify Email',
            html: `
                <h4>Dear ${user.name}!</h4>
                <p>Thank you for registration Amana service</p>
                <p>To verify your account, Please click link bellow or copy and paste your browser</p>
                <a href="${link}">Click Here </a>
                <p>Thank you</p>
                <p></p>
                <p><b>Amana team</b></p>
            `,
        };

        return await this.sendMail(data);
    }

    async sendMail(mailData: any): Promise<any> {
        return await SgMail.send(mailData);
    }

    async generateLink(email: string): Promise<string> {
        const nowUnixTime = moment().valueOf().toString();
        const token = BcryptHash.getHash(nowUnixTime);
        const expiredAt = moment().add(process.env.TOKEN_TIMEOUT, 'seconds').toString();

        await this.verifyEmailRepo.save({
            email,
            token,
            expiredAt,
        });

        const queryString = `?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`

        return `${process.env.FRONT_END_URL}/email-verification${queryString}`;
    }
}
