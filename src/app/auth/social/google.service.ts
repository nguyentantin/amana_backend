import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleService {
    private oAuth2Client;
    private readonly GOOGLE_PROFILE_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

    constructor() {
        this.oAuth2Client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
        );
    }

    public async getTokenInfo(accessToken: string): Promise<any> {
        // @TODO: Nghiên cứu viết định dạng trả object trả về. convert object to DTO.
        const data = await this.getProfile(accessToken);

        return {
            providerId: data.sub,
            email: data.email,
            name: data.name,
            avatar: data.picture,
        };
    }

    public async getProfile(accessToken: string): Promise<any> {
        this.oAuth2Client.credentials = { access_token: accessToken }
        const { data } = await this.oAuth2Client.request({
            method: 'GET',
            url: this.GOOGLE_PROFILE_URL,
        });

        return data;
    }
}
