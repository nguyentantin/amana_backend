import { EntityRepository, Repository } from 'typeorm';
import { Department } from '../../app/department/dto/department.entity';

@EntityRepository(Department)
export class DepartmentAdminRepository extends Repository<Department> {
}
