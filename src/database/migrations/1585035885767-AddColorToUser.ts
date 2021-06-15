import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColorToUser1585035885767 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('users', new TableColumn({
            name: 'color',
            type: 'varchar',
            default: '"#cec4fc"',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('users', 'color');
    }

}
