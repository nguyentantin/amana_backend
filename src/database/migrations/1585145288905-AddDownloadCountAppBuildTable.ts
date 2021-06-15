import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDownloadCountAppBuildTable1585145288905 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('app_builds', new TableColumn({
            name: 'download_count',
            type: 'int',
            default: 0,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('app_builds', 'download_count');
    }

}
