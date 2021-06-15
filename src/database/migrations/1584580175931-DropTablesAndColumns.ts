import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class DropTablesAndColumns1584580175931 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('role_permissions', true);
        await queryRunner.dropTable('permissions', true);
        await queryRunner.dropTable('project_members', true);
        await queryRunner.dropColumn('roles', 'guard');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        // Do nothing
    }
}
