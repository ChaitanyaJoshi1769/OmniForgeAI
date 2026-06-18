import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class AddDocumentAndCodeStudios1718747800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Documents table
    await queryRunner.createTable(
      new Table({
        name: 'documents',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'title', type: 'varchar' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 's3Key', type: 'varchar' },
          { name: 'fileSize', type: 'bigint' },
          { name: 'fileType', type: 'varchar' },
          { name: 'prompt', type: 'text', isNullable: true },
          { name: 'aiModel', type: 'varchar', isNullable: true },
          { name: 'workspaceId', type: 'uuid' },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
          { name: 'version', type: 'int', default: 1 },
        ],
        foreignKeys: [
          new TableForeignKey({ columnNames: ['workspaceId'], referencedTableName: 'workspaces', referencedColumnNames: ['id'], onDelete: 'CASCADE' }),
        ],
        indices: [
          new TableIndex({ name: 'idx_documents_workspaceId', columnNames: ['workspaceId'] }),
        ],
      }),
    );

    // Code repositories table
    await queryRunner.createTable(
      new Table({
        name: 'code_repositories',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'name', type: 'varchar' },
          { name: 'language', type: 'varchar' },
          { name: 'content', type: 'text' },
          { name: 'gitUrl', type: 'varchar', isNullable: true },
          { name: 'workspaceId', type: 'uuid' },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
          { name: 'version', type: 'int', default: 1 },
        ],
        foreignKeys: [
          new TableForeignKey({ columnNames: ['workspaceId'], referencedTableName: 'workspaces', referencedColumnNames: ['id'], onDelete: 'CASCADE' }),
        ],
        indices: [
          new TableIndex({ name: 'idx_code_repositories_workspaceId', columnNames: ['workspaceId'] }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('code_repositories', true);
    await queryRunner.dropTable('documents', true);
  }
}
