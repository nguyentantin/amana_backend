import { EntityRepository, Repository } from 'typeorm';
import { Log } from './dto/log.entity';

@EntityRepository(Log)
export class LogRepository extends Repository<Log> {
}
