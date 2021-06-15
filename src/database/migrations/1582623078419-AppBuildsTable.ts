import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { BuildEnv } from '../../app/app-build/dto/app-build.entity';

export class AppBuildsTable1582623078419 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'app_builds',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'build_number',
                    type: 'int',
                },
                {
                    name: 'commit_changes',
                    type: 'varchar',
                },
                {
                    name: 'version',
                    type: 'varchar',
                },
                {
                    name: 'project_id',
                    type: 'int',
                },
                {
                    name: 's3_key',
                    type: 'varchar',
                },
                {
                    name: 'bundle_id',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'app_name',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'filename',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'env',
                    type: 'enum',
                    enum: ['1', '2', '3'],
                    default: BuildEnv.dev,
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
        await queryRunner.dropTable('app_builds');
    }

}
