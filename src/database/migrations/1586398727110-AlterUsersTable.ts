import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterUsersTable1586398727110 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('users', new TableColumn({
            name: 'wc_username',
            type: 'varchar',
            isNullable: true,
        }));

        await queryRunner.addColumn('users', new TableColumn({
            name: 'birthday',
            type: 'date',
            isNullable: true,
            default: null,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('users', 'wc_username');
        await queryRunner.dropColumn('users', 'birthday');
    }
}
