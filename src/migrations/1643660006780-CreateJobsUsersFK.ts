import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class CreateJobsUsersFK1643660006780 implements MigrationInterface {
  fk: TableForeignKey = new TableForeignKey({
    name: 'FK_JOBS_USERS',
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'RESTRICT',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey('jobs', this.fk);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('jobs', this.fk.name);
  }
}
