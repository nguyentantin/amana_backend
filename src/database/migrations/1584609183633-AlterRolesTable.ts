import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterRolesTable1584609183633 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.changeColumn(
            'roles',
            new TableColumn({
                name: 'id',
                type: 'int',
                isPrimary: true,
            }),
            new TableColumn({
                name: 'id',
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        // do nothing
    }

}
