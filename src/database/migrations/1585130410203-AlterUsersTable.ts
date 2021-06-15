import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterUsersTable1585130410203 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('users', new TableColumn({
            name: 'avatar_id',
            type: 'int',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        //
    }

}
