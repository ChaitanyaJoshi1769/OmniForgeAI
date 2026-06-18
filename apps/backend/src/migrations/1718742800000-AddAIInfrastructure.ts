import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class AddAIInfrastructure1718742800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Models table
    await queryRunner.createTable(
      new Table({
        name: 'models',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'provider',
            type: 'varchar',
          },
          {
            name: 'modelId',
            type: 'varchar',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'modality',
            type: 'varchar',
          },
          {
            name: 'inputModality',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'outputModality',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'costPer1kInputTokens',
            type: 'numeric',
            precision: 10,
            scale: 6,
          },
          {
            name: 'costPer1kOutputTokens',
            type: 'numeric',
            precision: 10,
            scale: 6,
          },
          {
            name: 'contextWindow',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'maxOutputTokens',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'isPublic',
            type: 'boolean',
            default: true,
          },
          {
            name: 'capabilities',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'parameters',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'releasedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'deprecatedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'averageLatencyMs',
            type: 'numeric',
            precision: 4,
            scale: 2,
            default: '4.5',
          },
          {
            name: 'uptime',
            type: 'numeric',
            precision: 5,
            scale: 2,
            default: '99.9',
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
        indices: [
          new TableIndex({
            name: 'idx_models_provider',
            columnNames: ['provider'],
          }),
          new TableIndex({
            name: 'idx_models_modelId',
            columnNames: ['modelId'],
          }),
          new TableIndex({
            name: 'idx_models_modality',
            columnNames: ['modality'],
          }),
        ],
      }),
    );

    // Model Usage table
    await queryRunner.createTable(
      new Table({
        name: 'model_usage',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'modelId',
            type: 'varchar',
          },
          {
            name: 'organizationId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'workspaceId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'userId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'requestCount',
            type: 'integer',
          },
          {
            name: 'inputTokens',
            type: 'integer',
            default: 0,
          },
          {
            name: 'outputTokens',
            type: 'integer',
            default: 0,
          },
          {
            name: 'totalCostUSD',
            type: 'numeric',
            precision: 12,
            scale: 6,
            default: 0,
          },
          {
            name: 'averageLatencyMs',
            type: 'numeric',
            precision: 8,
            scale: 2,
            default: 0,
          },
          {
            name: 'successRate',
            type: 'numeric',
            precision: 5,
            scale: 2,
            default: 100,
          },
          {
            name: 'date',
            type: 'timestamp',
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
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
        indices: [
          new TableIndex({
            name: 'idx_model_usage_modelId',
            columnNames: ['modelId'],
          }),
          new TableIndex({
            name: 'idx_model_usage_organizationId',
            columnNames: ['organizationId'],
          }),
          new TableIndex({
            name: 'idx_model_usage_workspaceId',
            columnNames: ['workspaceId'],
          }),
          new TableIndex({
            name: 'idx_model_usage_userId',
            columnNames: ['userId'],
          }),
          new TableIndex({
            name: 'idx_model_usage_date',
            columnNames: ['date'],
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('model_usage', true);
    await queryRunner.dropTable('models', true);
  }
}
