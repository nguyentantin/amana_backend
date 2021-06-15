import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class BuildRequestsTable1582624174965 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'build_requests',
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
                    name: 'author_id',
                    type: 'int',
                },
                {
                    name: 'title',
                    type: 'varchar',
                },
                {
                    name: 'status',
                    type: 'tinyint',
                },
                {
                    name: 'description',
                    type: 'varchar',
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
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('build_requests');
    }

}
