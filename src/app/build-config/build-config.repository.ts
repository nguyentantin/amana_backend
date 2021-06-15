import { EntityRepository, Repository } from 'typeorm';
import { BuildConfig } from './dto/build-config.entity';

@EntityRepository(BuildConfig)
export class BuildConfigRepository extends Repository<BuildConfig> {
}
