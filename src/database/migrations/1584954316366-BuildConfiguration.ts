import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class BuildConfiguration1584954316366 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'build_configurations',
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
                    name: 'project_key',
                    type: 'varchar',
                    isUnique: true,
                },
                {
                    name: 'json_value',
                    type: 'json',
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
        await queryRunner.dropTable('build_configurations');
    }

}
