import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddStatusToEmailConfirmation1585901632376 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('email_confirmations', new TableColumn({
            name: 'status',
            type: 'varchar',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('email_confirmations', 'status');
    }

}
