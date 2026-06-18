import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class AddVideoStudio1718745800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'video_assets',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'name', type: 'varchar' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 's3Key', type: 'varchar' },
          { name: 's3Url', type: 'varchar', isNullable: true },
          { name: 'duration', type: 'numeric', precision: 8, scale: 2 },
          { name: 'width', type: 'integer' },
          { name: 'height', type: 'integer' },
          { name: 'fps', type: 'numeric', precision: 5, scale: 2, isNullable: true },
          { name: 'prompt', type: 'text', isNullable: true },
          { name: 'aiModel', type: 'varchar', isNullable: true },
          { name: 'aiGeneratedAt', type: 'timestamp', isNullable: true },
          { name: 'metadata', type: 'jsonb', isNullable: true },
          { name: 'tags', type: 'text', array: true, default: `'{}'` },
          { name: 'workspaceId', type: 'uuid' },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
          { name: 'version', type: 'int', default: 1 },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['workspaceId'],
            referencedTableName: 'workspaces',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        ],
        indices: [
          new TableIndex({ name: 'idx_video_assets_workspaceId', columnNames: ['workspaceId'] }),
          new TableIndex({ name: 'idx_video_assets_duration', columnNames: ['duration'] }),
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'video_segments',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'videoId', type: 'uuid' },
          { name: 'startTime', type: 'numeric', precision: 8, scale: 2 },
          { name: 'endTime', type: 'numeric', precision: 8, scale: 2 },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'sceneType', type: 'varchar', isNullable: true },
          { name: 'metadata', type: 'jsonb', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
          { name: 'version', type: 'int', default: 1 },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['videoId'],
            referencedTableName: 'video_assets',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        ],
        indices: [
          new TableIndex({ name: 'idx_video_segments_videoId', columnNames: ['videoId'] }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('video_segments', true);
    await queryRunner.dropTable('video_assets', true);
  }
}
