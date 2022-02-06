import { MigrationInterface, QueryRunner, Table, TableOptions } from 'typeorm';

export class CreateUsersTable1643146363772 implements MigrationInterface {
  tableOptions: TableOptions = {
    name: 'users',
    columns: [
      {
        name: 'id',
        type: 'varchar',
        length: '36',
        generationStrategy: 'uuid',
        isPrimary: true,
      },
      {
        name: 'email',
        type: 'varchar',
        length: '255',
        isUnique: true,
      },
      {
        name: 'password',
        type: 'varchar',
        length: '128',
      },
      {
        name: 'role',
        type: 'enum',
        enumName: 'UserRoles',
        enum: ['Regular', 'Manager'],
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
