import * as crypto from 'crypto';
import BcryptHash from './bcrypt.hash';
import * as moment from 'moment-timezone';
import * as _ from 'lodash';
import { Constants } from '../core/constants/Constants';

function passwordHash(password: string) {
    return crypto.createHmac('sha256', password)
        .digest('hex');
}

function getNow() {
    return  moment(new Date().toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'})).toDate();
}

const REQUEST_HEADER = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
};

const dateFormat = 'YYYY-MM-DD';

const PLATFORM_TYPE = {
    ios: 'ios',
    android: 'android',
};

const filterByKeys = (keys: string[], obj: object): object => {
    const data = {};

    for (const key of keys) {
        if (obj.hasOwnProperty(key)) {
            data[key] = obj[key];
        }
    }

    return data;
};

const formatDate = date => moment(date).format(Constants.DATE_FORMAT);

const getUsernameFromEmail = email => _.split(email, '@', 1)[0];

export {
    BcryptHash,
    passwordHash,
    REQUEST_HEADER,
    dateFormat,
    PLATFORM_TYPE,
    getNow,
    filterByKeys,
    formatDate,
    getUsernameFromEmail,
};
