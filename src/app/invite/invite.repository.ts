import { EntityRepository, Repository } from 'typeorm';
import { Invite } from './dto/invite.entity';

@EntityRepository(Invite)
export class InviteRepository extends Repository<Invite> {
}
