import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddIsDefaultPasswordToUser1586145350939 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('users', new TableColumn({
            name: 'is_default_password',
            type: 'boolean',
            default: false,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('users', 'is_default_password');
    }
}
