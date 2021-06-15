import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class StorageTable1582623345263 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'storage',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'name',
                    type: 'varchar',
                },
                {
                    name: 's3_key',
                    type: 'varchar',
                },
                {
                    name: 'is_temporary',
                    type: 'boolean',
                },
                {
                    name: 'storable_id',
                    type: 'int',
                },
                {
                    name: 'storable_type',
                    type: 'varchar',
                },
                {
                    name: 'entity_type',
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
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('storage');
    }

}
