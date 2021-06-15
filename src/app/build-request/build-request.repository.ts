import { EntityRepository, Repository } from 'typeorm';
import { BuildRequest } from './dto/build-request.entity';

@EntityRepository(BuildRequest)
export class BuildRequestRepository extends Repository<BuildRequest> {
}
