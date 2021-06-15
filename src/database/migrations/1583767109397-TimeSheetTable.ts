import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class TimeSheetTable1583767109397 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'time_sheets',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'neo_user_id',
                    type: 'int',
                },
                {
                    name: 'checkin_at',
                    type: 'timestamp',
                },
                {
                    name: 'checkout_at',
                    type: 'timestamp',
                    isNullable: true,
                    default: null,
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
        await queryRunner.dropTable('time_sheets');
    }

}
