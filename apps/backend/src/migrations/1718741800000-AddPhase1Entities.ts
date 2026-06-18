import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class AddPhase1Entities1718741800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Audit Logs table
    await queryRunner.createTable(
      new Table({
        name: 'audit_logs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'action',
            type: 'varchar',
          },
          {
            name: 'resource',
            type: 'varchar',
          },
          {
            name: 'resourceId',
            type: 'varchar',
          },
          {
            name: 'userId',
            type: 'uuid',
            isNullable: true,
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
            name: 'changes',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'ipAddress',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'userAgent',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
          },
          {
            name: 'errorMessage',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'durationMs',
            type: 'bigint',
            default: 0,
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
            name: 'idx_audit_logs_userId',
            columnNames: ['userId'],
          }),
          new TableIndex({
            name: 'idx_audit_logs_organizationId',
            columnNames: ['organizationId'],
          }),
          new TableIndex({
            name: 'idx_audit_logs_workspaceId',
            columnNames: ['workspaceId'],
          }),
          new TableIndex({
            name: 'idx_audit_logs_createdAt',
            columnNames: ['createdAt'],
          }),
          new TableIndex({
            name: 'idx_audit_logs_action',
            columnNames: ['action'],
          }),
        ],
      }),
    );

    // Invitations table
    await queryRunner.createTable(
      new Table({
        name: 'invitations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'token',
            type: 'varchar',
          },
          {
            name: 'organizationRole',
            type: 'enum',
            enum: ['owner', 'admin', 'member', 'guest'],
            isNullable: true,
          },
          {
            name: 'workspaceRole',
            type: 'enum',
            enum: ['owner', 'editor', 'viewer', 'member'],
            isNullable: true,
          },
          {
            name: 'message',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'isAccepted',
            type: 'boolean',
            default: false,
          },
          {
            name: 'acceptedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'expiresAt',
            type: 'timestamp',
          },
          {
            name: 'invitedByUserId',
            type: 'uuid',
            isNullable: true,
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
            columnNames: ['organizationId'],
            referencedTableName: 'organizations',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
          new TableForeignKey({
            columnNames: ['workspaceId'],
            referencedTableName: 'workspaces',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        ],
        indices: [
          new TableIndex({
            name: 'idx_invitations_email',
            columnNames: ['email'],
          }),
          new TableIndex({
            name: 'idx_invitations_token',
            columnNames: ['token'],
          }),
          new TableIndex({
            name: 'idx_invitations_organizationId',
            columnNames: ['organizationId'],
          }),
          new TableIndex({
            name: 'idx_invitations_workspaceId',
            columnNames: ['workspaceId'],
          }),
          new TableIndex({
            name: 'idx_invitations_expiresAt',
            columnNames: ['expiresAt'],
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('invitations', true);
    await queryRunner.dropTable('audit_logs', true);
  }
}
