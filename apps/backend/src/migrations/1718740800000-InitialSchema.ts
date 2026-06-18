import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class InitialSchema1718740800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Users table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'firstName',
            type: 'varchar',
          },
          {
            name: 'lastName',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'passwordHash',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'emailVerified',
            type: 'boolean',
            default: false,
          },
          {
            name: 'emailVerifiedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'avatar',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'bio',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'authProviders',
            type: 'text',
            array: true,
            default: `'{}'`,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'lastLoginAt',
            type: 'timestamp',
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
            name: 'idx_users_email',
            columnNames: ['email'],
          }),
        ],
      }),
    );

    // API Keys table
    await queryRunner.createTable(
      new Table({
        name: 'api_keys',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'hashedKey',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'scopes',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'allowedIps',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'expiresAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'lastUsedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'userId',
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
            columnNames: ['userId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        ],
      }),
    );

    // Organizations table
    await queryRunner.createTable(
      new Table({
        name: 'organizations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'slug',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'logo',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'website',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'plan',
            type: 'varchar',
            default: "'free'",
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'settings',
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
            name: 'idx_organizations_slug',
            columnNames: ['slug'],
          }),
        ],
      }),
    );

    // Workspaces table
    await queryRunner.createTable(
      new Table({
        name: 'workspaces',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'slug',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'icon',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'settings',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'organizationId',
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
            columnNames: ['organizationId'],
            referencedTableName: 'organizations',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        ],
        indices: [
          new TableIndex({
            name: 'idx_workspaces_organizationId',
            columnNames: ['organizationId'],
          }),
          new TableIndex({
            name: 'idx_workspaces_slug',
            columnNames: ['slug'],
          }),
          new TableIndex({
            name: 'idx_workspaces_organizationId_slug',
            columnNames: ['organizationId', 'slug'],
            isUnique: true,
          }),
        ],
      }),
    );

    // Organization Members table
    await queryRunner.createTable(
      new Table({
        name: 'organization_members',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'role',
            type: 'enum',
            enum: ['owner', 'admin', 'member', 'guest'],
            default: "'member'",
          },
          {
            name: 'permissions',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'inviteEmail',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'inviteToken',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'isInvitationAccepted',
            type: 'boolean',
            default: false,
          },
          {
            name: 'invitationAcceptedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'userId',
            type: 'uuid',
          },
          {
            name: 'organizationId',
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
            columnNames: ['userId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
          new TableForeignKey({
            columnNames: ['organizationId'],
            referencedTableName: 'organizations',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        ],
        indices: [
          new TableIndex({
            name: 'idx_organization_members_organizationId_userId',
            columnNames: ['organizationId', 'userId'],
            isUnique: true,
          }),
        ],
      }),
    );

    // Workspace Members table
    await queryRunner.createTable(
      new Table({
        name: 'workspace_members',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'role',
            type: 'enum',
            enum: ['owner', 'editor', 'viewer', 'member'],
            default: "'member'",
          },
          {
            name: 'permissions',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'joinedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'userId',
            type: 'uuid',
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
            columnNames: ['userId'],
            referencedTableName: 'users',
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
            name: 'idx_workspace_members_workspaceId_userId',
            columnNames: ['workspaceId', 'userId'],
            isUnique: true,
          }),
        ],
      }),
    );

    // Assets table
    await queryRunner.createTable(
      new Table({
        name: 'assets',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
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
            name: 'mimeType',
            type: 'varchar',
          },
          {
            name: 'fileSize',
            type: 'bigint',
          },
          {
            name: 's3Key',
            type: 'varchar',
          },
          {
            name: 's3Url',
            type: 'varchar',
            isNullable: true,
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
            name: 'collectionIds',
            type: 'uuid',
            array: true,
            isNullable: true,
          },
          {
            name: 'thumbnailS3Key',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'embedding',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'duration',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'width',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'height',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'isPublished',
            type: 'boolean',
            default: false,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'archivedAt',
            type: 'timestamp',
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
            name: 'idx_assets_workspaceId',
            columnNames: ['workspaceId'],
          }),
          new TableIndex({
            name: 'idx_assets_workspaceId_name',
            columnNames: ['workspaceId', 'name'],
          }),
          new TableIndex({
            name: 'idx_assets_workspaceId_modality',
            columnNames: ['workspaceId', 'modality'],
          }),
          new TableIndex({
            name: 'idx_assets_createdAt',
            columnNames: ['createdAt'],
          }),
        ],
      }),
    );

    // Asset Versions table
    await queryRunner.createTable(
      new Table({
        name: 'asset_versions',
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
            type: 'int',
          },
          {
            name: 's3Key',
            type: 'varchar',
          },
          {
            name: 'fileSize',
            type: 'bigint',
          },
          {
            name: 'mimeType',
            type: 'varchar',
          },
          {
            name: 'checksum',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
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
            name: 'assetId',
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
            columnNames: ['assetId'],
            referencedTableName: 'assets',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        ],
        indices: [
          new TableIndex({
            name: 'idx_asset_versions_assetId',
            columnNames: ['assetId'],
          }),
          new TableIndex({
            name: 'idx_asset_versions_assetId_createdAt',
            columnNames: ['assetId', 'createdAt'],
          }),
        ],
      }),
    );

    // Enable UUID extension
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('asset_versions', true);
    await queryRunner.dropTable('assets', true);
    await queryRunner.dropTable('workspace_members', true);
    await queryRunner.dropTable('organization_members', true);
    await queryRunner.dropTable('workspaces', true);
    await queryRunner.dropTable('organizations', true);
    await queryRunner.dropTable('api_keys', true);
    await queryRunner.dropTable('users', true);
  }
}
