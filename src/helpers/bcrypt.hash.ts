import * as bcrypt from 'bcrypt';

class BcryptHash {
    private saltRounds = 10;

    getHash(originString: string): string|null {
        return originString ? bcrypt.hashSync(originString, this.saltRounds) : null;
    }

    compareHash(compareString: string, hashString: string): boolean {
        return hashString ? bcrypt.compareSync(compareString, hashString) : false;
    }
}

export default new BcryptHash();
