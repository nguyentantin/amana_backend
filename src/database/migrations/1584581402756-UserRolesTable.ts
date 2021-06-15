import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class UserRolesTable1584581402756 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'user_roles',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'member_id',
                    type: 'int',
                },
                {
                    name: 'role_id',
                    type: 'int',
                },
                {
                    name: 'project_id',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    isNullable: true,
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    isNullable: true,
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
            indices: [
                {
                    columnNames: ['project_id', 'member_id', 'role_id'],
                    isUnique: true,
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('user_roles', true);
    }
}
