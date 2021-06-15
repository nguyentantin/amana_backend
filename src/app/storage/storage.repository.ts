import { EntityRepository, Repository } from 'typeorm';
import { Storage } from './dto/storage.entity';

@EntityRepository(Storage)
export class StorageRepository extends Repository<Storage> {
}
