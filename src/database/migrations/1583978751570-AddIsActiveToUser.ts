import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddIsActiveToUser1583978751570 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('users', new TableColumn({
            name: 'is_active',
            type: 'boolean',
            default: false,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('user', 'is_active');
    }

}
