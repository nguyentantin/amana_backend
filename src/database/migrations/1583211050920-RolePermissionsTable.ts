import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class RolePermissionsTable1583211050920 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'role_permissions',
            columns: [
                {
                    name: 'role_id',
                    type: 'int',
                },
                {
                    name: 'permission_id',
                    type: 'int',
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('role_permissions');
    }

}
