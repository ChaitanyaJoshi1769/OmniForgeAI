import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class AddTextStudio1718743800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Text Documents table
    await queryRunner.createTable(
      new Table({
        name: 'text_documents',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'content',
            type: 'text',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'varchar',
            default: "'blog'",
          },
          {
            name: 'format',
            type: 'varchar',
            default: "'markdown'",
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'tags',
            type: 'text',
            array: true,
            default: `'{}'`,
          },
          {
            name: 'tone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'readingLevelGrade',
            type: 'numeric',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'wordCount',
            type: 'integer',
            default: 0,
          },
          {
            name: 'characterCount',
            type: 'integer',
            default: 0,
          },
          {
            name: 'isPublished',
            type: 'boolean',
            default: false,
          },
          {
            name: 'publishedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'aiGeneratedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'aiModel',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'sourceUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'workspaceId',
            type: 'uuid',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'version',
            type: 'int',
            default: 1,
          },
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
          new TableIndex({
            name: 'idx_text_documents_workspaceId',
            columnNames: ['workspaceId'],
          }),
          new TableIndex({
            name: 'idx_text_documents_type',
            columnNames: ['type'],
          }),
        ],
      }),
    );

    // Text Versions table
    await queryRunner.createTable(
      new Table({
        name: 'text_versions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'versionNumber',
            type: 'integer',
          },
          {
            name: 'content',
            type: 'text',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'wordCount',
            type: 'integer',
            default: 0,
          },
          {
            name: 'characterCount',
            type: 'integer',
            default: 0,
          },
          {
            name: 'createdByUserId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'isCurrent',
            type: 'boolean',
            default: false,
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'documentId',
            type: 'uuid',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'version',
            type: 'int',
            default: 1,
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['documentId'],
            referencedTableName: 'text_documents',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        ],
        indices: [
          new TableIndex({
            name: 'idx_text_versions_documentId',
            columnNames: ['documentId'],
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('text_versions', true);
    await queryRunner.dropTable('text_documents', true);
  }
}
