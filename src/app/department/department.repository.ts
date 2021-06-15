import { EntityRepository, Repository } from 'typeorm';
import { Department } from './dto/department.entity';

@EntityRepository(Department)
export class DepartmentRepository extends Repository<Department> {
}
