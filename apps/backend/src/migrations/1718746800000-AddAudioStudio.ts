import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class AddAudioStudio1718746800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'audio_assets',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'name', type: 'varchar' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 's3Key', type: 'varchar' },
          { name: 'duration', type: 'numeric', precision: 8, scale: 2 },
          { name: 'sampleRate', type: 'integer', default: 44100 },
          { name: 'channels', type: 'integer', default: 2 },
          { name: 'bitrate', type: 'integer', isNullable: true },
          { name: 'format', type: 'varchar', default: "'mp3'" },
          { name: 'prompt', type: 'text', isNullable: true },
          { name: 'aiModel', type: 'varchar', isNullable: true },
          { name: 'voice', type: 'varchar', isNullable: true },
          { name: 'language', type: 'varchar', isNullable: true },
          { name: 'isMusic', type: 'boolean', default: false },
          { name: 'metadata', type: 'jsonb', isNullable: true },
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
          new TableIndex({ name: 'idx_audio_assets_workspaceId', columnNames: ['workspaceId'] }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('audio_assets', true);
  }
}
