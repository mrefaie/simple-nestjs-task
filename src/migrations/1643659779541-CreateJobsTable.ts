import { MigrationInterface, QueryRunner, Table, TableOptions } from 'typeorm';

export class CreateJobsTable1643659779541 implements MigrationInterface {
  tableOptions: TableOptions = {
    name: 'jobs',
    columns: [
      {
        name: 'id',
        type: 'varchar',
        length: '36',
        generationStrategy: 'uuid',
        isPrimary: true,
      },
      {
        name: 'title',
        type: 'varchar',
        length: '100',
      },
      {
        name: 'description',
        type: 'longtext',
        isNullable: true,
      },
      {
        name: 'user_id',
        type: 'varchar',
        length: '36',
      },
    ],
  };

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table(this.tableOptions), true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableOptions.name, true);
  }
}
