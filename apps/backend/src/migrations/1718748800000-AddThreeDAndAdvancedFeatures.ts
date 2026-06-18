import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class AddThreeDAndAdvancedFeatures1718748800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 3D Models table
    await queryRunner.createTable(
      new Table({
        name: 'models_3d',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'name', type: 'varchar' },
          { name: 's3Key', type: 'varchar' },
          { name: 'format', type: 'varchar' },
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
      }),
    );

    // Workflows table
    await queryRunner.createTable(
      new Table({
        name: 'workflows',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'name', type: 'varchar' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'config', type: 'jsonb' },
          { name: 'workspaceId', type: 'uuid' },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
          { name: 'version', type: 'int', default: 1 },
        ],
        foreignKeys: [
          new TableForeignKey({ columnNames: ['workspaceId'], referencedTableName: 'workspaces', referencedColumnNames: ['id'], onDelete: 'CASCADE' }),
        ],
      }),
    );

    // Agents table
    await queryRunner.createTable(
      new Table({
        name: 'agents',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'name', type: 'varchar' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'config', type: 'jsonb' },
          { name: 'workspaceId', type: 'uuid' },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
          { name: 'version', type: 'int', default: 1 },
        ],
        foreignKeys: [
          new TableForeignKey({ columnNames: ['workspaceId'], referencedTableName: 'workspaces', referencedColumnNames: ['id'], onDelete: 'CASCADE' }),
        ],
      }),
    );

    // Governance Policies table
    await queryRunner.createTable(
      new Table({
        name: 'governance_policies',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'name', type: 'varchar' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'config', type: 'jsonb' },
          { name: 'organizationId', type: 'uuid' },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
          { name: 'version', type: 'int', default: 1 },
        ],
        foreignKeys: [
          new TableForeignKey({ columnNames: ['organizationId'], referencedTableName: 'organizations', referencedColumnNames: ['id'], onDelete: 'CASCADE' }),
        ],
      }),
    );

    // Marketplace table
    await queryRunner.createTable(
      new Table({
        name: 'marketplace_items',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'name', type: 'varchar' },
          { name: 'description', type: 'text' },
          { name: 'category', type: 'varchar' },
          { name: 'config', type: 'jsonb' },
          { name: 'publishedBy', type: 'uuid' },
          { name: 'price', type: 'numeric', precision: 10, scale: 2 },
          { name: 'downloads', type: 'integer', default: 0 },
          { name: 'rating', type: 'numeric', precision: 3, scale: 2, isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
          { name: 'version', type: 'int', default: 1 },
        ],
        indices: [
          new TableIndex({ name: 'idx_marketplace_items_category', columnNames: ['category'] }),
          new TableIndex({ name: 'idx_marketplace_items_publishedBy', columnNames: ['publishedBy'] }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('marketplace_items', true);
    await queryRunner.dropTable('governance_policies', true);
    await queryRunner.dropTable('agents', true);
    await queryRunner.dropTable('workflows', true);
    await queryRunner.dropTable('models_3d', true);
  }
}
