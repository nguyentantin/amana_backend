import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterTableUsers1585886069399 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('users', new TableColumn({
            name: 'department_id',
            type: 'int',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('users', 'department_id');
    }

}
