import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddIsCurrentToAppBuild1583977803368 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('app_builds', new TableColumn({
            name: 'is_current',
            type: 'boolean',
            default: false,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('app_builds', 'is_current');
    }

}
