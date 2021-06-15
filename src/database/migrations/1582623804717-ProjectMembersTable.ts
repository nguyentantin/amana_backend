import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ProjectMembersTable1582623804717 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'project_members',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'project_id',
                    type: 'int',
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
        await queryRunner.dropTable('project_members');
    }

}
