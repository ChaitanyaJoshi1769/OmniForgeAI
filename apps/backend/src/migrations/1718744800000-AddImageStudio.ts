import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class AddImageStudio1718744800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'image_assets',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'name', type: 'varchar' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'type', type: 'varchar', default: "'image'" },
          { name: 's3Key', type: 'varchar' },
          { name: 's3Url', type: 'varchar', isNullable: true },
          { name: 'thumbnailS3Key', type: 'varchar', isNullable: true },
          { name: 'width', type: 'integer' },
          { name: 'height', type: 'integer' },
          { name: 'fileSize', type: 'bigint' },
          { name: 'format', type: 'varchar', default: "'JPEG'" },
          { name: 'prompt', type: 'text', isNullable: true },
          { name: 'aiModel', type: 'varchar', isNullable: true },
          { name: 'aiGeneratedAt', type: 'timestamp', isNullable: true },
          { name: 'metadata', type: 'jsonb', isNullable: true },
          { name: 'tags', type: 'text', array: true, default: `'{}'` },
          { name: 'embedding', type: 'text', isNullable: true },
          { name: 'isPublished', type: 'boolean', default: false },
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
          new TableIndex({ name: 'idx_image_assets_workspaceId', columnNames: ['workspaceId'] }),
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'image_versions',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'versionNumber', type: 'integer' },
          { name: 's3Key', type: 'varchar' },
          { name: 'width', type: 'integer' },
          { name: 'height', type: 'integer' },
          { name: 'fileSize', type: 'bigint' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'isCurrent', type: 'boolean', default: false },
          { name: 'assetId', type: 'uuid' },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
          { name: 'version', type: 'int', default: 1 },
        ],
        foreignKeys: [
          new TableForeignKey({ columnNames: ['assetId'], referencedTableName: 'image_assets', referencedColumnNames: ['id'], onDelete: 'CASCADE' }),
        ],
        indices: [
          new TableIndex({ name: 'idx_image_versions_assetId', columnNames: ['assetId'] }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('image_versions', true);
    await queryRunner.dropTable('image_assets', true);
  }
}
