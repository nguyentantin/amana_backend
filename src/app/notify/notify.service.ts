import { Injectable } from '@nestjs/common';
import { AppLogger } from '../../core/logger';
import { SendNotifyWorkchatInterface } from './interfaces/send-notify-workchat.interface';
import { driver } from '@rocket.chat/sdk';

@Injectable()
export class NotifyService {
    private logger = new AppLogger(NotifyService.name);

    async sendNotifyWorkChat(params: SendNotifyWorkchatInterface) {
        // @TODO need get project config (rocket user/pass, url, room, vv)
        const HOST = process.env.WC_URL;
        const USER = process.env.WC_USER;
        const PASS = process.env.WC_PASS;
        const SSL = true;  // server uses https ?
        const ROOM = process.env.WC_ROOM;
        const conn = await driver.connect({ host: HOST, useSsl: SSL });
        const myUserId = await driver.login({ username: USER, password: PASS });
        const msg = NotifyService.getMsgSendWc(params);

        const sent = await driver.sendToRoom(msg, ROOM);
        this.logger.log(sent);
    }

    private static getMsgSendWc(params: SendNotifyWorkchatInterface): string {
        const link = `${process.env.FRONT_END_URL}/projects/${params.projectId}/app-build/${params.buildId}`;
        return `
        @here
        BUILD SUCCESS [${params.projectName}] #${params.buildId}
        *Version:* ${params.version}
        *Commit Changes:* ${params.commitChanges}
        *Link:* ${link}
        `;
    }
}
