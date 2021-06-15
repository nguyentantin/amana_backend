import { EntityRepository, Repository } from 'typeorm';
import { Role } from './dto/role.entity';

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {
}
