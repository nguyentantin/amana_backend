import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class SetUserPasswordNullable1584410958138 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.changeColumn(
            'users',
            new TableColumn({
                name: 'password',
                type: 'varchar',
            }),
            new TableColumn({
                name: 'password',
                type: 'varchar',
                isNullable: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.changeColumn(
            'users',
            new TableColumn({
                name: 'password',
                type: 'varchar',
                isNullable: true,
            }),
            new TableColumn({
                name: 'password',
                type: 'varchar',
            }),
        );
    }

}
