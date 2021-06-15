import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColorToProject1585032846176 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('projects', new TableColumn({
            name: 'color',
            type: 'varchar',
            default: '"#cec4fc"',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('projects', 'color');
    }

}
